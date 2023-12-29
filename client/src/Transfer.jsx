import { useState } from "react";
import { sha256 } from "ethereum-cryptography/sha256";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";
import server from "./server";

// monkeypatch prototype for sending signature to server
BigInt.prototype.toJSON = function() { return this.toString() }

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

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

    const transaction = {
      sender: address,
      amount: parseInt(sendAmount),
      publicKey,
      recipient,
    };

    const messageHash = sha256(utf8ToBytes(JSON.stringify(transaction)));
    const signature = secp.sign(messageHash, privateKey);
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
        Private Key
        <input
          placeholder="e41868a1ca56..."
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
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
