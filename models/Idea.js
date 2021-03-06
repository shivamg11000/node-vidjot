const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema= new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    casts : [String],
    videoURL : {
        type: String,
        required: false
    }
    
});

module.exports = mongoose.model('Idea', IdeaSchema);