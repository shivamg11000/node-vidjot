const express = require('express')
const usersRouter = express.Router()

const User = require('../models/User')

const doesEmailExist = require('../helpers/doesEmailExist')

// login page
usersRouter.get('/login', (req, res) => {
    res.render('users/login')
})

//  Signup page
usersRouter.get('/register', (req, res) => {
    res.render('users/register')
})

// register user
usersRouter.post('/register', async (req, res) => {
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


// Login the user
usersRouter.post('/login', (req, res, next) => {     // user is authenticated only here
    User.findOne({email: req.body.email})            // cookie is set containing session ID
        .then(async user => {                        // session data is stored in mongodb
            if (!user) {
                req.flash('error_msg', 'Wrong email')
                return res.redirect('/users/login')
            }
            if (!await user.matchPassword(req.body.password)) {
                req.flash('error_msg', 'Wrong password')
                return res.redirect('/users/login')
            }
            req.session.user = user.id
            req.session.save(() => {    // save session then redirect
                req.flash('success_msg', 'Successfully Logged In')
                res.redirect('/ideas')
            })
        })
})


// Logout the user
usersRouter.get('/logout', (req, res, next) => {
    req.session.user = null
    req.session.save(() => {
        req.flash('success_msg', 'You are successfully logged Out!')
        res.redirect('/users/login')
    })
})



module.exports = usersRouter
