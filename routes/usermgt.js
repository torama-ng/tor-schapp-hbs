var express = require('express');
var router = express.Router();
console.log(__dirname);
var walkSync = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  const walk = require('../walk.js');
  walkSync = walk.walkSync('usermgt');
  res.render('view', { 
    videoTitle: 'User Mgt Videos',
    videoFiles: walkSync,
    videoDir: 'usermgt'

  });
});



module.exports = router;
