var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

const subjectsData = require('../models/subject');
// const videosPath = path.join(__dirname, '../videos');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	
    
    subjectsData.find({}).sort({name: 'asc'}).exec((err, result) => {
        if (err) {
            console.log('error in subject find',err)
            return res.send('Error Encountered')
        }
        if (result) {
            
            // docj = JSON.stringify(doc);
            count = result.length;
            
            res.render('listcourses', { 
                title: 'List of Courses',
                result,
                count
            });
        
        }
    })
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