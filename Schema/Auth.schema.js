const Joi = require("joi")

const signInWithUsername = Joi.object({
    username: Joi.string().strip().alphanum().min(3).max(15).required(),
    password: Joi.string().min(6).max(25).required(),
})

const signInWithEmail = Joi.object({
    email: Joi.string().strip().email().required(),
    password: Joi.string().min(6).max(25).required(),
})

const signUp = Joi.object({
    email: Joi.string().strip().email().required(),
    password: Joi.string().min(6).max(25).required(),
    firstName: Joi.string().strip().pattern(/^[A-Za-z]{1,15}$/),
    lastName: Joi.string().strip().pattern(/^[A-Za-z]{1,15}$/),
    username: Joi.string().strip().alphanum().min(3).max(15).required()
})

module.exports = {signInWithEmail, signInWithUsername, signUp}