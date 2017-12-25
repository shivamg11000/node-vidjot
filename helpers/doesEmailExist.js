const User = require('../models/User')

module.exports = function doesEmailExist(email) {  // returns true if BSON exists with given email in db

    return new Promise(resolve => {
        User.findOne({
            email: email
        })
        .then(user => {
            if (user){
                resolve(true)
            } else {
                resolve(false)
            }
        })
        .catch(err => {
            if (err)  throw err
        })
    })
    
}
