const auth = require("./Auth.schema")

module.exports = {
    signIn: {
        email: auth.signInWithEmail,
        username: auth.signInWithUsername
    },
    signUp: auth.signUp
}