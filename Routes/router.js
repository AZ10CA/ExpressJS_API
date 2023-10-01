const express = require("express")
const signUp = require("./sign-up");
const signIn = require("./sign-in");


const router = express.Router()

// User sign-up action
router.post("/sign-up", signUp.middleware, signUp.handler)

router.post("/sign-in", signIn.middleware, signIn.handler)

module.exports = router