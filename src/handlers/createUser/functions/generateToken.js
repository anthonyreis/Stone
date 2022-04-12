const jwt = require('jsonwebtoken');

module.exports.generateToken = async ({ id, username }) => {
    try {
        const token = await jwt.sign({
            id, username
        },
            process.env.JWT_KEY)
    
        return token;
    } catch (err) {
        return {
            statusCode: err.statusCode ?? 500,
            body: JSON.stringify({
                message: err.message ? err.message : 'An unexpected error occurred'
            })
        }
    }
}