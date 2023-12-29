import { getAddress } from '../../shared/getAddress';

function KeyPair({ privateKey, publicKey }) {
  return (
    <div className="key">
        <span className="key-title">PrivateKey: </span>{privateKey}
        <br/>
        <span className="key-title">PublicKey: </span>{publicKey}
        <br/>
        <span className="key-title">Address: </span>{getAddress(publicKey)}
    </div>
  );
}

export default KeyPair;
