var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},

    activity: [{
        path: String,
        duration: Number,
        act_date: { type: Date, default: Date.now },
      
	}],
	phone1: String,
	phone2: String,
	address: {
		street: String,
		city: String,
		state: String,
		zipcode: String,
		country:String
	},
	reference: {
		name: String,
		phone: String,
		email:String
	},
	start_date: Date,
	end_date: Date,
	qualifications: [{
		school:String,
		diploma:String,
		subject:String,
		date_obtained:Date
	}],
	work_experience: [{
		place:String,
		roles:String,
		start_year:Date,
		end_year:Date

	}]

	
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}