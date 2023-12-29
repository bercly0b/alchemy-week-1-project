import Wallet from "./Wallet";
import Transfer from "./Transfer";
import KeyPair from "./KeyPair";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} />
      <div className="keys">
        <KeyPair
            publicKey="0340733a6ca8b36c8794e9453eebdb7fb8dd435be5d8bd6cb802ef5f5391bfaced"
            privateKey="2b8a71c5f1a0307a693ecb95a12c61bcf1e41868a1ca565a094686c7ce3f9e61"
        />
        <KeyPair
            publicKey="036e7013a71f368aa8477bffd9bcea3d2c096a6f518aff8f89ac6de388155da009"
            privateKey="79231c1e02cbd5e8ab4983612bb9791041c732610d78756db2cee3b6da6db0f7"
        />
        <KeyPair
            publicKey="023e467b5dadd2bf45b3b1e520be879bfe80cad3dc7b622c176c6ef8c4d8ea48d6"
            privateKey="7fcc2c8b5995a023961804b195af9edbfb79f5b8486fd6dee5952a7ffff814ec"
        />
      </div>
    </div>
  );
}

export default App;
