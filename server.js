const app = require("./app")
const db = require("./mongo.init")

// Start the server
const port = process.env.NODE_ENV === 'dev' ? process.env.DEV_PORT : process.env.PRODUCTION_PORT
const server = app.listen(port, async () => {
    console.log(`- Server is up on port ${port}`)
    await db.default_client.connect() // optional
    console.log("- MongoDB is connected")
})


// When the server is terminated
process.on("SIGINT", async () => {
    server.close()
    await db.default_client.close()
    console.log("- Server is terminated")
    process.exit(0)
})