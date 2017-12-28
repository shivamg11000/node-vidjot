const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String
    },
    googleData: {            // data on google database related to the user
        id: String,          // unique id on google db
        displayName: String  // display name on google
    },
    facebookData: {          // data on facebook database related to the user
        id: String,
        displayName: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// hash password before saving
UserSchema.pre('save', function(next) {
    if (!this.password) // if there is no password in db
        return next() 

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err)  throw err
            this.password = hash
            next()
        })
    })
})

// match password, returns true or false
UserSchema.methods.matchPassword = function(passwordAttempt) {
    return new Promise(resolve => {
        if (!this.password)
            return resolve(false)

        bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
            if (err) {
                throw err
                resolve(false)
            } else {
                resolve(isMatch)
            }    
        })

    })
}

module.exports = mongoose.model('User', UserSchema)