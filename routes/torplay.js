var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

// Get course routes
router.get('/*', ensureAuthenticated, function(req, res){
  console.log(req.body);
  console.log(`path ${req.path}`);

  // Each folder is a video category.
  // for each category, get all the mp4 files
  catObj = [];  //store all folders and their mp4files
  folder = path.basename(req.path);
    
  fpath = path.join(__dirname, '../videos',folder);
	console.log(`fpath ${fpath}`)
  mp4files = fs.readdirSync(fpath);
  
	let stats = fs.statSync(fpath);
	mtime = new Date(stats.mtime);
	let seconds = (new Date().getTime() - stats.mtime) / 1000;
	let gid = stats.dev + stats.ino;
	let days = (seconds/(60*60*24)).toFixed(0);
		
	catObj.push({category:folder,files:mp4files,mtime:days,gid:gid})
  
	res.render('view_play', { 
    videoTitle: folder,
    videoGroup: catObj,
    videoDir: folder
      
  });
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