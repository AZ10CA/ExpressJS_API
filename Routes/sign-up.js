const { ObjectId } = require("mongodb")
const http_status = require("http-status-codes");

const db = require("../mongo.init");
const schema = require("../Schema/schema");
const server_helpers = require("../Helper/server")
const js_helpers = require("../Helper/js-helpers");

const middleware = async (req, res, next) => {
    // MIDDLEWARE
    const body = req.body
    if (!!!body) {
        return res.sendStatus(http_status.BAD_REQUEST)
    }

    js_helpers.strip(body, ['email', 'username', 'firstName', 'lastName'])
    const {error, value} = schema.signUp.validate(body);
    if (error) {
        return res
            .status(http_status.BAD_REQUEST)
            .send({message: error.message})
    }

    next()
}

const handler = async (req, res) => {
    // REQUEST HANDLER
    const { email, password, username, firstName, lastName } = js_helpers.extract(req.body, ['email', 'password', 'username', 'firstName', 'lastName'])
    try {
        // make sure email and username are both unique
        const count = await db
            .coll(process.env.USERS_COLLECTION)
            .countDocuments({
                $or: [
                    { username },
                    { email }
                ]
            })

        // User already exists
        if(count !== 0){
            return res
                .status(http_status.PRECONDITION_FAILED)
                .json({
                    message: "User exists"
                })
        }
        const _id = new ObjectId()
        const token = await server_helpers.generate_token({_id: _id.toString()})

        await db
            .coll(process.env.USERS_COLLECTION)
            .insertOne({
                email, username, firstName, lastName,
                password: await server_helpers.hash_password(password),
                token,
                _id
            })

        return res
            .status(http_status.CREATED)
            .json({
                token
            })
    } catch (err) {
        // Log the error
        console.log(err)
        return res
            .sendStatus(http_status.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    middleware,
    handler
}