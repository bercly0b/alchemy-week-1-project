import { useState } from "react";
import { sha256 } from "ethereum-cryptography/sha256";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";
import server from "./server";
import { getAddress } from '../../shared/getAddress';

// monkeypatch prototype for sending signature to server
BigInt.prototype.toJSON = function() { return this.toString() }

function Transfer({ privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    let publicKey;

    try {
      publicKey = toHex(secp.getPublicKey(privateKey));
    } catch (ex) {
      alert(ex.message);
      return;
    }

    const address = getAddress(publicKey);

    const transaction = {
      sender: address,
      amount: parseInt(sendAmount),
      publicKey,
      recipient,
    };

    const messageHash = sha256(utf8ToBytes(JSON.stringify(transaction)));
    const signature = secp.sign(messageHash, privateKey);
    transaction.messageHash = toHex(messageHash);
    transaction.signature = signature;

    try {
      const { data: { balance } } = await server.post(`send`, transaction);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="10"
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input
        type="submit"
        className="button"
        value="Transfer"
        disabled={!privateKey || !sendAmount || !recipient}
      />
    </form>
  );
}

export default Transfer;
