const crypto = require('crypto');

function getKeyFromConfig(key) {
    const salt = Buffer.from(process.env.SALT_KEY || 'secertSalt', 'utf8');
    const derivedKey = crypto.pbkdf2Sync(key, salt, 1000, 32, 'sha256');
    return derivedKey;
}

function encrypt(value) {
    const ITERATIONS = 3; //encrypt data 3 times in a loop to provide enhanced security
    const encryptionKey = process.env.ENCRYPTION_KEY || 'secertkey';
    let eValue = value;
    for (let i = 0; i < ITERATIONS; i++) {
        const cipher = crypto.createCipheriv('aes-256-ctr', getKeyFromConfig(encryptionKey), Buffer.alloc(16, 0));
        let encrypted = cipher.update(eValue, 'utf8', 'base64');
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

function maskData(data) {
    return '*'.repeat(data.length);
}

module.exports = {
    encrypt,
    hashWithSalt,
    maskData
}

