var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const { getCode, getData } = require('country-list');

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	console.log(req.user);
	res.render('login', {
		userObj: req.user || null		
	});

});

router.get('/listusers', function (req, res) {
	console.log(req.user);
	User.find({}).sort({name: 'asc'}).exec((err, users) => {
		console.log(users)
		res.render('userview', {
			users
		});
	})
	

});

// user edit form
router.get('/userform', function (req, res) {
	id = req.user._id
	countries = getData();
	console.log(countries)
	User.findById(id, function (err, user) {
		if (err) throw err
    	console.log(` user for form is ${user}`)
		res.render('useredit', {
			user,
			countries
		});
	})
	

});



// Update User
router.post('/useredit', ensureAuthenticated, function(req, res, next){

    User.findById(req.user._id, function (err, user) {
		if (err) throw err
        
        if (!user) {
            req.flash('error', 'No account found');
            return res.redirect('/users/useredit');
        }

        // good idea to trim 
		if (req.body.email)
			email = req.body.email.trim();
		if (req.body.username)
        	username = req.body.username.trim();
		if (req.body.name)
			name = req.body.name.trim();
		if (req.body.phone1)
			phone1 = req.body.phone1.trim();
		if (req.body.phone2)
			phone2 = req.body.phone2.trim();
		
		if (req.body.street)
			street = req.body.street.trim()
		if (req.body.city)
			city = req.body.city.trim()
		if (req.body.state)
			state = req.body.state.trim()
		if (req.body.country)
			country = req.body.country.trim()
		if (req.body.zipcode)
			zipcode = req.body.zipcode.trim()
			
		address = {
			street: street,
			city: city,
			state: state,
			country: country,
			zipcode: zipcode
		};

		if (req.body.ref_name)
			ref_name = req.body.ref_name.trim()
		if (req.body.ref_phone)
			ref_phone = req.body.ref_phone.trim()
		if (req.body.ref_email)
			ref_email = req.body.ref_email.trim()

		reference = {
			name: ref_name,
			phone: ref_phone,
			email: ref_email,
		}

        // validate 
        if ( !name ) { // is a falsey
            req.flash('error', 'One or more fields are empty');
            return res.redirect('/users/useredit'); 
        }

        // no need for else since you are returning early ^
        // user.email = email;  // need to verify that no duplicate emails. Handle later
        // user.local.email = email; 
        user.name = name;
        
        user.username = username; // will update this late
		user.email = email;
		user.phone1 = phone1;
		user.phone2 = phone2;
		user.address = address;
		user.reference = reference;


        // don't forget to save!
        user.save(function (err) {
			if (err) throw err;
            // todo: don't forget to handle err

            res.redirect('/users/listusers');
        });
    });
});

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;