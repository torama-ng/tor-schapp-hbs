const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const VideoSchema = new Schema({
    name: { 
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    author: {
        type: String,
        required: false
    },
    authorlink: {
        type: String,
        required: false
    },
   
    summary: {
        type: String,
        required: false
    },
    transcript: {
        type: String,
        required: false
    },
    
    date_updated: {
        type: Date,
        default: Date.now
    }

});

// @params modelname, Schemaname, collectionname
var Videos = module.exports  = mongoose.model('videoschema',VideoSchema,'videos');

// get Videos
module.exports.getVideos = function(callback,limit) {
    
    Videos.find(callback).limit(limit);
    
}


// get Video
module.exports.getVideoById = function(id,callback) {
    
    Videos.findById(id,callback);
    
}

module.exports.addVideo = function(video,callback) {
    Videos.create(video,callback);
}

module.exports.updateVideo = function(id,video,callback) {
    var query = {_id: id};
    var update = {
        name: video.name,
        filename: video.filename,
        category: video.category
    };
    Videos.findOneAndUpdate(query,update,options,callback);
}

module.exports.removeVideo = function(id,callback){
    var query = {_id: id};
    Videos.remove(query,callback);
}