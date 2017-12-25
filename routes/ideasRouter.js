const express = require('express')
const ideasRouter = express.Router()
const { ensureAuthenticated } = require('../helpers/auth') 

const Idea = require('../models/Idea')

ideasRouter.use(ensureAuthenticated) // protect ideas route for unauthorized

// add Idea page 
ideasRouter.get('/add', (req, res) => {
    res.render('ideas/add')
})

// edit page
ideasRouter.get('/edit/:id', (req, res) => {

    Idea.findOne({
        _id: req.params.id,
        user: req.user
    })
    .then(idea => {
        res.render('ideas/edit', {idea: idea})
    })
})

//get ideas
ideasRouter.get('/', (req, res) => {

    Idea.find({user: req.user})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {ideas: ideas})
        })
})

// add idea
ideasRouter.post('/', (req, res) => {
    // server side validation
    let errors = []

    if (!req.body.title) {
        errors.push({text: 'Please add a title'})
    }
    if (!req.body.details) {
        errors.push({text: 'Please add a details'})
    }

    if (errors.length) {              // if there are errors send the error message
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user
        }
        new Idea(newIdea)
            .save()
            .then(idea => {
                req.flash('success_msg', 'New Idea Created')
                res.redirect(req.baseUrl + '/')
            })

        
    }

})

// edit Form process
ideasRouter.put('/:id', (req, res) => {
   
    Idea.findOne({
        _id: req.params.id,
        user: req.user
    })
    .then(idea => {
        // updated values
        idea.title = req.body.title
        idea.details = req.body.details
        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Idea updated')
                res.redirect(req.baseUrl + '/')
            })
    })

})

// delete idea 
ideasRouter.delete('/:id', (req, res) => {

    Idea.findOneAndRemove({
        _id: req.params.id,
        user: req.user
    })
    .then(ideaDeleted => {
        req.flash('success_msg', 'Idea successfully deleted')
        res.redirect(req.baseUrl + '/')
    })
        
})




module.exports = ideasRouter