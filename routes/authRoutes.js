const express = require('express')
const router = express.Router()
const passport = require('passport')


// Local auth
// Login the user
router.post('/local', passport.authenticate('local',{            // never use succesRedirect option when using persistent sessions, passport redirects before saving sessions
    failureRedirect: '/users/login',                                  // explicitly save session on success   
    failureFlash: true                                                // authentication via passport done here only
}), (req, res) => {                                                   // using local strategy - means credentials are mathced in the database only
    //user credentials matched in db, then
    req.session.save(() => {
        req.flash('success_msg', 'Logged In Successfully')
        res.redirect('/ideas')
    })

})               


// google oauth2.0
router.get('/google', passport.authenticate('google',{
    scope: ['email', 'profile']
}))


router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: '/users/login'
}), (req, res) => {
    req.session.save(() => {
        req.flash('success_msg', 'Logged In via Google Successfully')
        res.redirect('/ideas')
    })
})


// facebook oauth2.0


module.exports = router





