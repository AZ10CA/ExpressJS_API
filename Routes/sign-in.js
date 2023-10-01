const bcrypt = require("bcrypt")
const http_status = require("http-status-codes")

const db = require("../mongo.init")
const server_helpers = require("../Helper/server");
const schema = require("../Schema/schema")
const js_helpers = require("../Helper/js-helpers")
const { Mutex } = require("async-mutex")


const mutex = new Mutex()

const middleware = (req, res, next) => {
    let body = js_helpers.extract(req.body, ['email', 'password', 'username'])
    if(!!!body){
        return res
            .sendStatus(http_status.BAD_REQUEST)
    }

    // try using email
    const { err } = schema.signIn.email.validate(body)
    if(err) {
        const { _err } = schema.signIn.username.validate(body)
        if(_err){
            return res
                .sendStatus(http_status.UNAUTHORIZED)
        }
    }
    next()
}

const handler = async (req, res) => {
    await mutex.acquire() // --- GET MUTEX ---
    const { email, username, password } = js_helpers.extract(req.body, ['email', 'username', 'password'])
    try {
        const coll = db.coll(process.env.USERS_COLLECTION)
        // EXISTENCE CHECK
        const record = await coll
            .findOne({
                $or: [
                    { username },
                    { email }
                ]
            })

        if(!record){
            mutex.release() // --- RELEASE MUTEX ---
            return res
                .status(http_status.PRECONDITION_FAILED)
                .json({message: "Invalid username/email"})
        }
            // PASSWORD CHECK
        if (await bcrypt.compare(password, record.password)) {
            const token = await server_helpers.generate_token({_id: record._id.toString()})
            await coll.findOneAndUpdate({ _id: record._id }, { $set: {token: token.toString()}})

            mutex.release() // --- RELEASE MUTEX ---
            return res
                .status(http_status.OK)
                .json({token})
        } else {
            mutex.release() // --- RELEASE MUTEX ---
            return res
                .status(http_status.UNAUTHORIZED)
                .json({message: "Invalid username/email or password"})
        }
    } catch (e) {
        console.log(e)
        mutex.release() // --- RELEASE MUTEX ---
        return res
            .sendStatus(http_status.INTERNAL_SERVER_ERROR)
    }

}

module.exports = {
    middleware,
    handler
}