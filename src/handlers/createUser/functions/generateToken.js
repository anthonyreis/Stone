const jwt = require('jsonwebtoken');

module.exports.generateToken = async ({ id, username, email }) => {
    const token = await jwt.sign({
        id, username, email
    },
        process.env.JWT_KEY)

    return token;
}