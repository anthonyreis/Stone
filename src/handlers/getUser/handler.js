const createError = require('http-errors');
const commonMiddleware = require('../../../common/middleware');
const { validUser } = require("./functions/validUser");

const getUser = async (event, context) => {
    try {
        const { id } = event.pathParameters;

        const user = await validUser(id);

        return {
            status_code: 200,
            body: user
        };
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            body: JSON.stringify({
                message: err.message || 'An unexpected error occurred'
            })
        }
    }
}

module.exports.handler = commonMiddleware(getUser)