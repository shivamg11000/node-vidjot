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
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// hash password before saving
UserSchema.pre('save', function(next) {

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