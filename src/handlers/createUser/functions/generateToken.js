const jwt = require('jsonwebtoken');

module.exports.generateToken = async ({ id, username }) => {
    const token = await jwt.sign({
        id, username
    },
        process.env.JWT_KEY)

    return token;
}