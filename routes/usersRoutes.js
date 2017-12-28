const express = require('express')
const router = express.Router()

const User = require('../models/User')

const { doesEmailExist } = require('../helpers/doesEmailExist')

// login page
router.get('/login', (req, res) => {
    res.render('users/login')
})

//  Signup page
router.get('/register', (req, res) => {
    res.render('users/register')
})

// register user
router.post('/register', async (req, res) => {
    // server side validation
    let errors = []

    if (req.body.password != req.body.password2) {   // password typed in confirm password do not match
        errors.push({text: 'Passwords do not match'})
    }
    if (req.body.password.length<4) {                // password less than 4 chars
        errors.push({text: 'Password must be atleast 4 characters'})
    } 
    if (await doesEmailExist(req.body.email)) {                // email already taken
        errors.push({text: 'Email already registered, Pls use another email'})
    }

    if (errors.length) {     // error in some credentials
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        }) 
    } else {                   // create new user to the db
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        newUser.save((err, user) => {
            if (err)  throw err
            req.flash('success_msg', 'You are registered successfully and now can login')
            res.redirect(req.baseUrl + '/login')
        })
    }

})
                                          
                                                                      

// Logout the user
router.get('/logout', async (req, res, next) => {
    req.logout()                                  // passport added a logout function to the req object
    req.flash('success_msg', 'You are successfully logged Out!')
    res.redirect('/users/login')
})


module.exports = router
