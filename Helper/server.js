const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const uuid  = require("uuid")

const generate_token = async (payload) => {
    return await jwt.sign(
        {
            payload,
            __date: Date.now().toString(),
            __uuid: uuid.v4().toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "14d"
        })
}

const hash_password = async (password) => {
    return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
}


module.exports = {generate_token, hash_password}