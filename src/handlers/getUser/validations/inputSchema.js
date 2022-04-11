const Joi = require('joi');

const schema = Joi.object({
    id: Joi.string().required()
})

module.exports = schema;