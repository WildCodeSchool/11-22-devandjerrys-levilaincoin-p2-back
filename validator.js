const Joi = require("joi");

// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
const userSignInSchema = Joi.object({


    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    email: Joi.string()
        // .pattern(new RegExp('[a-zA-Z0-9]+@'))
        // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .max(255)
        .required(),
    password: Joi.string()
        .max(255)
        .min(5)
        // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    passwordConfirmation: Joi.ref('password'),
});

// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

const validateUserSignIn = (req, res, next) => {
    const { firstName, lastName, email, password, passwordConfirmation } = (req.body[0]);

    const { error } = userSignInSchema.validate(
        { firstName, lastName, email, password, passwordConfirmation },
        { abortEarly: false }
    );

    if (error) {
        res.status(422).json({ validationErrors: error.details });
        console.log(req.body)
    } else {
        next();
    }
};

module.exports = {
    validateUserSignIn,
};