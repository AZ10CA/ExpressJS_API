const jwt = require("jsonwebtoken")
const http_status = require("http-status-codes")
const db = require("../mongo.init")

const verify = async (req, res, next) => {
    // check if the token is valid using jwt.verify
    const token = req.body['token']
    console.log(`Verifying Token: ${token}`)
    // Func isValidJWT
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        // check if the valid token is also present in our database for that user
        const collection = db.coll("Users")
        const is_in_db = !!await collection
            .countDocuments({
                _id: payload._id,
                token
            })

        if(is_in_db)
            return res
                .sendStatus(http_status.UNAUTHORIZED)

        next()
    } catch (error) {
        return res
            .sendStatus(http_status.UNAUTHORIZED)
    }
}

module.exports = verify

