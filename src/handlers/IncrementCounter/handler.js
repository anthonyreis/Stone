const countapi = require('countapi-js');
const commonMiddleware = require('../../../common/middleware');
const schema = require('./validations/inputSchema');
const { validator } = require('./validations/validator');

const incrementCounter = async (event, context) => {
    try {
        validator(schema, event.pathParameters);

        const { key } = event.pathParameters;

        const result = await countapi.hit(key);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Hit at ${result.path}`
            })
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

module.exports.handler = commonMiddleware(incrementCounter)