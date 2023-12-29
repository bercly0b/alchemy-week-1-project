const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1: secp } = require("ethereum-cryptography/secp256k1");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "6cb802ef5f5391bfaced": 100,
  "8f89ac6de388155da009": 50,
  "2c176c6ef8c4d8ea48d6": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, publicKey, messageHash } = req.body;

  // restore biging in signature
  signature.r = BigInt(signature.r);
  signature.s = BigInt(signature.s);

  const isSigned = secp.verify(signature, messageHash, publicKey);

  if (!isSigned) {
    res.status(400).send({ message: "Message is not signed!" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
