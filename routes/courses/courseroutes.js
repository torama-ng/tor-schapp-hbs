const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
const dree = require('dree')
const trim = require('deep-trim-node');

const subjectsData = require('../../models/subject');
const subjectsDree = require('../../models/subjectdree');

const videosPath = path.join(__dirname, '../../videos');

router.get('/listree',(req,res,next) => {
    subjectsDree.find({}).sort({name: 'asc'}).exec((err, children) => {    
        if (err) return res.status(404).send('Error Encountered');
        if (children) {
            console.log('Just testing here');
            res.render('listree', { 
                title: 'Tree of subjects',
                children,
                count:children.length
            });        
        }
    })
})

router.post('/walkdel', (req,res,next) => {

    if (process.env.PLATFORM != "PROD"){
        return res.send('This is not PROD environment. Data is not deleted');
    }
    subjectsDree.deleteMany({},(err,result)=>{

    })
    .then(() => {
        res.redirect('/courses/listree');
        // return res.send(' All subjectsdree  deleted');
    })
    .catch((err) => {
        return res.status(500).send(`${err} Error in dree Data delete`);
    })  
})


// recursive walk down videospath and load
router.post('/treeload', (req,res,next) => {
   
    const options = {
        stat: true,
        normalize: true,
        sizeInBytes: false,
        hash: false,
        size: true,
        isSymbolicLink: true,
        depth: 5,
        exclude: /desc/,
        extensions: [ 'mp4' ]
      };
    
    dirs = fs.readdirSync(videosPath)
    if (process.env.PLATFORM !="PROD") {
        return res.send('Wrong platform')
    }

    //read data from db

    // data insert
    dirs.forEach( doc => {
        const tree = dree.scan(path.join(videosPath,doc), options);
        // inject a boolean file 
        
        let subjectd = new subjectsDree({
            name:tree.name.trim(),
            type:tree.type.trim(),
            path:tree.path.trim(),
        
            children:trim(tree.children)
        });

        subjectd.save()
        .then ( () => {
            console.log(`${doc} tree saved in db`);
            
        })
        .catch ((err) => {
                console.log(err);
              
        })
    
    })
    res.send('data saved to db')
    
})

// List all Courses/subjects and video files under them
router.get('/', ensureAuthenticated, (req,res,next) => {
    subq = req.query.subject;
    
    subjectsData.find({}).sort({name: 'asc'}).exec((err, result) => {    
        if (err) res.status(404).send('Error Encountered');
        else if (result) {
            if (subq){
                res.render('listcourses', { 
                    title: 'List of subjects',
                    result,
                    count:result.length,
                    subq
                });    
            }
            else {
                res.render('listcourses', { 
                    title: 'List of Courses',
                    result,
                    count: result.length
                });
            }
            
        }
    })
})


// find and display one subject by name
router.get('/:name', ensureAuthenticated, (req,res,next) => {
    
    subject = req.params.name;
    
    subjectsData.findOne({name:subject}, (err, doc)=>{
        if (err) error = 'Error Encountered in model findOnes';
        else if (doc) {        
            // sort courses
          
            courses = doc.courses;      
            count = courses.length;
            /*
            var mapped = courses.map(function(el, i) {
                return { index: i, value: el.filename.toLowerCase() };
              })
            */
            // console.log(`before sort ${courses}`)
            sorted_courses = courses.sort ( (a,b) => {
                return a.toString().localeCompare(b)
            })
            
            
            sorted_courses = courses.sort( 
                (a, b) => {
                    if (a.filename < b.filename ) {
                      return -1;
                    }
                    if (a.filename > b.filename) {
                      return 1;
                    }
                    
                    return 0;
                  }
            );
            if (sorted_courses != courses) {
                console.log('there is diff')
            }
            else {
                console.log('no diff')
            }

            category = subject;

            res.render('search', { 
                title: 'Course Category',
                category,
                result: sorted_courses,
                count
            });
        }
    })
})

// list courses under a subject
router.get('/:subject/:course', ensureAuthenticated, (req,res,next) => {
    subject = req.params.subject;
    course = req.params.course ;
    let result = [];
    subjectsData.findOne({name:subject}, (err, doc)=>{
        if (err) error = 'Error Encountered in model findOnes';
        else if (doc) {        
            doc.courses.forEach(cs => {
                if((cs.filename).toLowerCase().indexOf(course.toLowerCase()) > 0) {
                  //  res.send('Result found');
                    result.push( cs.filename);
                }
            }) ;
            
            count = result.length;          
            res.render('search', { 
                title: 'Search Result',
                result: result,
                count
            });
        }
      
    })
})

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;