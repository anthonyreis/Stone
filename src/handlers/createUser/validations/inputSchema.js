const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(9)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,16}$'))
        .required(),
})

module.exports = schema;