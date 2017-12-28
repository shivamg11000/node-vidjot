const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

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


    // google oauth
    passport.use(new GoogleStrategy({
        // id and secret are given on google's developer page, oauth api
        clientID: '701474689447-74rn9pgamm3g8r6qh9mhfihcq4o9hqlh.apps.googleusercontent.com',
        clientSecret: 'rat0v8WkoGpulfY4yIKIArt7',
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

    
    // facebook oauth
    passport.use(new FacebookStrategy({
        clientID: '1757616487880895',
        clientSecret: '3ab15b7662e0f0dc05b34e0d326f0b39',
        callbackURL: "/auth/facebook/redirect",
        profileFields: ['id', 'displayName', 'email']   // profile return many fields, to explicitally recieve certain fields
      },
      async(accessToken, refreshToken, profile, cb) => {
          
        const facebookID = profile.id
        const name = profile.displayName
        const emailID = profile.emails[0].value

        const user = await User.findOne({email: emailID})

        if (user) {
            return cb(null, user)
        }
        const newUser = new User({
            email: emailID,
            name: name,
            facebookData: {
                id: facebookID,
                displayName: name
            }
        })
        newUser.save().then((user) => {
            return cb(null, user)
        })
      }
    ))
    

    passport.serializeUser((user, done) => { // when user is authenticated serialize user ID to the session
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => { // on every request made to the server use that ID stored in the session to find the user in the database
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })


}