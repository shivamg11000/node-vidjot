const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

const User = require('../models/User')


module.exports = function(passport) {

    // local 
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
            .catch(err => {
                done(err)
            })

    }))


    // google OAuth2.0
    passport.use(new GoogleStrategy({
        // id and secret are given on google's developer page, oauth api
        clientID: '872315115673-6a5h28e7ag4gcqndievjt6gfbeu82f65.apps.googleusercontent.com',
        clientSecret: '8FdZPVbz2B26CRf6oTpACA0e',
        callbackURL: '/auth/google/redirect'

    }, async (accessToken, refreshToken, profile, cb) => {
        const googleID = profile.id
        const name = profile.displayName
        const emailID = profile.emails[0].value

        const user = await User.findOne({email: emailID})

        if (user) {
            return cb(null, user)
        }
        const newUser = new User({
            email: emailID,
            name: name,
            googleData: {
                id: googleID,
                displayName: name
            }
        })
        newUser.save().then((user) => {
            return cb(null, user)
        })

    }))


    passport.serializeUser((user, done) => { // when user is authenticated serialize user ID to the session
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => { // on every request made to the server use that ID stored in the session to find the user in the database
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })


}