const Joi = require('joi');

const schema = Joi.object({
    key: Joi.string()
        .pattern(new RegExp('^[A-Za-z0-9_\\-.]{3,64}$'))
        .required(),
})

module.exports = schema;