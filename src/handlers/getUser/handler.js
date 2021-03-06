const commonMiddleware = require('../../../common/middleware');
const { validUser } = require("./functions/validUser");
const schema = require('./validations/inputSchema');
const {validator} = require('./validations/validator');

const getUser = async (event, context) => {
    try {
        validator(schema, event.pathParameters);

        const { id } = event.pathParameters;
        const {id: tokenId} = event.requestContext.authorizer.lambda;

        if (id !== tokenId) return {
            statusCode: 403,
            body: JSON.stringify({
                message: 'You cant access information from this user'
            })
        }

        const user = await validUser(id);

        if (user.statusCode) return user

        return {
            statusCode: 200,
            body: JSON.stringify(user)
        };
    } catch (err) {
        return {
            statusCode: err.statusCode ?? 500,
            body: JSON.stringify({
                message: err.message ? err.message : 'An unexpected error occurred'
            })
        }
    }
}

module.exports.handler = commonMiddleware(getUser)