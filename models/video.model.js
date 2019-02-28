const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Defining a data representation
var videoDataSchema = new Schema({
    subjectid: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjectdree'
    },
    description: { type: String, required: false },
    author: { type: String, required: false }    
});

// Creating a collection
var videoData = mongoose.model("Video", videoDataSchema);

module.exports = videoData;