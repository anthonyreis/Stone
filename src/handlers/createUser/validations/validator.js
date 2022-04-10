const createError = require('http-errors');

module.exports.validator = (schema, params) => {
    const validParams = schema.validate(params);

    if (validParams.error) {
        throw new createError.BadRequest(validParams.error.details[0].message);
    }
}