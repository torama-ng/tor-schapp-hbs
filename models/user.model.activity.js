var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({

    activity: [{
        path: String,
        duration: Number,
        date: { type: Date, default: Date.now },
        userid: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
    }]
});
var User = module.exports = mongoose.model('User', UserSchema);
