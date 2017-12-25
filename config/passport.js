const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')


module.exports = function(passport) {

    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        
        User.findOne({email: email})
            .then(async user => {
                if (!user) {
                    return done(null, false, {message: 'No User Found'})
                }
                if (!await user.matchPassword(password)) { 
                    return done(null, false, {message: 'Password did not matched!'})
                }
                return done(null, user)
            })

    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}