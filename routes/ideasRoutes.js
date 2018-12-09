const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../helpers/auth') 

const Idea = require('../models/Idea')

router.use(ensureAuthenticated) // protect ideas route for unauthorized

// add Idea page 
router.get('/add', (req, res) => {
    res.render('ideas/add')
})

// edit Idea page
router.get('/edit/:id', (req, res) => {

    Idea.findOne({
        _id: req.params.id,
        user: req.user
    })
    .then(idea => {
        res.render('ideas/edit', {idea: idea})
    })
})

//get ideas
router.get('/', (req, res) => {

    Idea.find({user: req.user})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {ideas: ideas})
        })
})

// add idea
router.post('/', (req, res) => {
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
            details: req.body.details,
            casts: req.body.casts.split(',')
        })
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user,
            casts: req.body.casts.split(',')
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
router.put('/:id', (req, res) => {
   
    Idea.findOne({
        _id: req.params.id,
        user: req.user
    })
    .then(idea => {
        // updated values
        idea.title = req.body.title
        idea.details = req.body.details
        idea.casts = req.body.casts.split(',')
        
        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Idea updated')
                res.redirect(req.baseUrl + '/')
            })
    })

})

// delete idea 
router.delete('/:id', (req, res) => {

    Idea.findOneAndRemove({
        _id: req.params.id,
        user: req.user
    })
    .then(ideaDeleted => {
        req.flash('success_msg', 'Idea successfully deleted')
        res.redirect(req.baseUrl + '/')
    })
        
})


// adding video functionality
// add video (actually its a edit request with all same details except video is added)
router.put('/:id/video', (req, res) => {
    
    Idea.findOne({
        _id: req.params.id,
        user: req.user
    })
    .then(idea => {
        // adding video URL
        idea.videoURL = req.body.url;
        idea.save()
            .then(idea => {
                res.status(200).json({ msg: 'video added' });
            })
        
    })

})



module.exports = router