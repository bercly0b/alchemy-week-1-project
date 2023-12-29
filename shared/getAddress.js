const getAddress = (publicKey) => {
    return publicKey.slice(-20);
};

module.exports = getAddress;
