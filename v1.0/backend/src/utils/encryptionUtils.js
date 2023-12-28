const crypto = require('crypto');

function encrypt(value) {
    const ITERATIONS = 3; //encrypt data 3 times in a loop to provide enhanced security
    const encryptionKey = process.env.ENCRYPTION_KEY || 'secertkey';
    let eValue = value;

    for (let i = 0; i < ITERATIONS; i++) {
        const cipher = crypto.createCipher('aes-256-ctr', encryptionKey);
        let encrypted = cipher.update(encryptionKey + eValue, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        eValue = encrypted;
    }

    return eValue;
}
  
function hashWithSalt(data) {
    const salt = process.env.SALT_KEY || 'seceretsaltkey';
    const hash = crypto.createHash('sha256');
    hash.update(data + salt); // Concatenate password and salt before hashing
    return hash.digest('hex');
}

module.exports = {
    encrypt,
    hashWithSalt
}

