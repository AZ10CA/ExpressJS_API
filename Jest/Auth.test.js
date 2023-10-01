const request = require("supertest")
const app = require("../app")
const http_status = require("http-status-codes")
const db = require("../mongo.init")
const { generate_token } = require("../Helper/server");
const { ObjectId } = require("mongodb")

beforeAll(async () => {
    // connect to the database first
    await db.default_client.connect()
    await request(app)
        .post("/api/v1/sign-up")
        .send({
            email: "sample@gmail.com",
            password: "password123",
            username: "sample",
            firstName: "John",
            lastName: "Doe"
        })
})

afterAll(async () => {
    await db.coll(process.env.USERS_COLLECTION)
        .deleteMany({})
    await db.default_client.close()
})

test("JWT generates unique tokens", async () => {
    const id = new ObjectId()
    const tokens = {}
    const cnt = 10000
    for(let i = 0; i < cnt; i++){
        const token = await generate_token({id})
        tokens[token] = true
    }

    expect(Object.keys(tokens).length).toBe(cnt)
})

describe("sign-up process", () => {
    it("don't sign up an existing user", async () => {
        const response = await request(app)
            .post("/api/v1/sign-up")
            .send({
                username: "sample",
                email: "different@gmail.com",
                password: "password123"
            })

        expect(response.status).toBe(http_status.PRECONDITION_FAILED)
        expect(response.body.token).toBeFalsy()
    })

    it("sign in an existing user and receive a token", async () => {
        const response = await request(app)
            .post("/api/v1/sign-in")
            .send({
                email: "sample@gmail.com",
                password: "password123"
            })
        expect(response.status).toBe(http_status.OK)
        expect(response.body.token).toBeTruthy()
    })

    it("update the database with a new token after each sign in", async () => {
        let response = await request(app)
            .post("/api/v1/sign-in")
            .send({
                username: "sample",
                password: "password123"
            })

        const token = response.body.token

        response = await request(app)
            .post("/api/v1/sign-in")
            .send({
                email: "sample@gmail.com",
                password: "password123"
            })

        expect(response.status).toBe(http_status.OK)
        expect(response.body.token).not.toBe(token)
    })
})

