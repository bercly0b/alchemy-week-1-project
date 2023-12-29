import server from "./server";
import { toHex } from "ethereum-cryptography/utils";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";
import { getAddress } from '../../shared/getAddress';

function Wallet({ privateKey, setPrivateKey, balance, setBalance }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    let publicKey;
    try {
      publicKey = toHex(secp.getPublicKey(privateKey));
    } catch (_) {}

    if (publicKey) {
      const address = getAddress(publicKey);

      const { data: { balance } } = await server.get(`balance/${address}`);

      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        PrivateKey
        <input placeholder="0307a693ecb95a12c61..." value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
