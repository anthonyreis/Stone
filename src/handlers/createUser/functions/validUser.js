const bcrypt = require('bcryptjs');
const { createUser } = require('./createUser');
const { generateToken } = require('./generateToken');
const { uniqueUser } = require('./uniqueUser');

module.exports.validUser = async ({username, password}) => {
    try {
        const unique = await uniqueUser(username);

        if (unique.statusCode) return unique;
        
        const hashPassword = await bcrypt.hash(password, 8);

        const user = await createUser(username, hashPassword);

        if (user.statusCode) return user;

        const token = await generateToken(user);

        if (token.statusCode) return token;

        return {
            id: user.id,
            username: user.username,
            token,
        }
    } catch (err) {
        return {
            statusCode: err.statusCode ?? 500,
            body: JSON.stringify({
                message: err.message ? err.message : 'An unexpected error occurred'
            })
        }
    }
}