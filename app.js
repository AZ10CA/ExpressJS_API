const http_status = require("http-status-codes")
const express = require('express')
const api_v1_router = require("./Routes/router")
const middlewares = require("./Middleware/global")


const app = express()

// Middlewares
app.use("*", middlewares)

// Put your API routes here
//      Session routes
app.use("/api/v1", api_v1_router)


app.get("/is_up", (req, res) => {
    res
        .status(http_status.OK)
        .send("Server is up and working!")
})


// Invalid routes handler
app.get("*", (req, res) => {
    return res
        .sendStatus(http_status.NOT_FOUND)
})


module.exports = app