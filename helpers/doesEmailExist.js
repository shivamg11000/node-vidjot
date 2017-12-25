const User = require('../models/User')

module.exports = {
    doesEmailExist: function (email) {  // returns true if email exists in db

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
}