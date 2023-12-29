const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const getAddress = require('../../shared/getAddress');

const privatKey = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privatKey);

console.log('privatKey', toHex(privatKey));
console.log('publicKey', toHex(publicKey));
console.log('address', getAddress(toHex(publicKey)));
