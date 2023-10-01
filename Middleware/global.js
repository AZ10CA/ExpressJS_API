const express = require("express")
const js_helpers = require("../Helper/js-helpers")
const router = express.Router()

router.use(express.json())

// Put your middlewares here
router.use((req, res, next) => {
    console.log("Global middleware triggered")
    js_helpers.lower(req.body, ['email'])
    js_helpers.strip(req.body, ['email', 'username', 'firstName', 'lastName'])
    next()
})


module.exports = router