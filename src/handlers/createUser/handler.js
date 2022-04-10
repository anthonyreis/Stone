const createError = require('http-errors');
const commonMiddleware = require('../../../common/middleware');
const { validUser } = require("./functions/validUser")
const schema = require('./validations/inputSchema');
const { validator } = require('./validations/validator');

const createUser = async (event, context) => {
    try {
        validator(schema, event.body);

        const user = await validUser(event.body);

        return {
            status_code: 201,
            body: {
                message: `User ${user.username} created successfully with id ${user.id}`
            }
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            body: JSON.stringify({
                message: err.message || 'An unexpected error occurred'
            })
        }
    }
}

module.exports.handler = commonMiddleware(createUser)