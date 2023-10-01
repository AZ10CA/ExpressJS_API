const { MongoClient, ServerApiVersion } = require('mongodb');


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// default client object
const default_client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        poolSize: 50,
        maxPoolSize: 100
    }
});

const coll = (coll, db_client = default_client, db_name = process.env.DB_NAME) => {
    return db_client
        .db(db_name)
        .collection(coll)
}

module.exports = {default_client, coll}