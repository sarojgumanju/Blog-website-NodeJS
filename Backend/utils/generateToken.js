const jwt = require ("jsonwebtoken");

async function generateJWt(payload) {
    let token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
}

async function verifyJWT(token) {
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        return data;
    } catch (error) {
        return false;
    }
}

module.exports = {generateJWt, verifyJWT};