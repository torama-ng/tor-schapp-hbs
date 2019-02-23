const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
const subjectsData = require('../../models/subject');

const videosPath = path.join(__dirname, '../../videos');
const videosPath2 = "";


// find and delete one course/ by name
// /data/delete/?subject=php&id=88373827
// to delete only subject do /data/delete?subject=subjname    
router.post('/delete', ensureAuthenticated, (req,res,next) => {
    subject = req.body.subject;
    course_id = req.body.id;

    if (!subject){
        return res.send('Subject required for delete');
    }
    if (subject && !course_id) {
        if (subject != 'ALL') {
            subjectsData.findOneAndDelete({name:subject},(err,result)=>{

            })
            .then(() => {
                return res.send(' subject  deleted');
            })
            .catch((err) => {
                return res.status(500).send(`${err} Error in Subject delete`);
            })  
        }
    }

    if (subject && course_id) {
        console.log (`deleting ${subject}/${course_id}`);
        subjectsData.updateOne({name:subject},{$pull: {"courses":{"_id":course_id}}})
        .then(() => {
            console.log('subdoc deleted');
           // window.location.reload();
            res.redirect('/courses#'+subject);
        })
        .catch((err) => {
            return res.status(500).send(`${err} Error in Data delete`);
        })
    }
    else{
        
        // Delete All?
        if (subject == "ALL"){
            if (process.env.PLATFORM != "PROD"){
                return res.send('This is not PROD environment. Data is not deleted');
            }
            subjectsData.deleteMany({},(err,result)=>{

            })
            .then(() => {
                return res.send(' All subjects  deleted');
            })
            .catch((err) => {
                return res.status(500).send(`${err} Error in Data delete`);
            })  
        }
    }
})

// update subject with new subject or course with known id with new filename
// /data/update?subject=php&update=phpnew
// /data/update?subject=php&id=id&cupdate=newcoursefilename
router.put('/update', ensureAuthenticated, (req,res,next) => {
    subject = req.query.subject;
    course_id = req.query.id;
    course_filenameu = req.query.cupdate;
    subjectu = req.query.update;

    console.log (`updating ${subject}/${course_id}`);
    // /data/update?subject=php&update=phpnew
    if ( subject && subjectu && !course_filenameu) {
        subjectsData.update({name:subject},{$set:{"name":subjectu}})
        .then(() => {
            return res.send(' subject updated');
        })
        .catch((err) => {
            return res.status(500).send(`${err} Error in Data update`);
        }) 
    }
    // /data/update?subject=php&id=id&cupdate=newcoursefilename
    if (subject && course_id && course_filenameu) {
        subjectsData.findOneAndUpdate({"name": subject}, {$set: {"courses": {"filename":course_filenameu}}},  function(err,doc) {
            if (err) { throw err; }
            else { console.log(`Updated ${doc}`); }
        })
        .then(() => {
            return res.send(' course filename updated');
        })
        .catch((err) => {
            return res.status(500).send(`${err} Error in Data update`);
        })   
    }
})


// Load data
//dataloader - loads toplevel courses/subjects and video class files
router.post('/dataloader', ensureAuthenticated, (req,res,next) => {
    // check environment
    if (process.env.PLATFORM != "PROD"){
        return res.send('This is not PROD environment. Data not loaded');
    }
	subjects = fs.readdirSync(videosPath);
	
	subjects.forEach(folder => {
	  
	  // First check the folder if it exists on the collection, before inserting
		subjectsData.findOne({name:folder}, (err, doc)=>{
			if (err) return res.status(404).send('Error Encountered');
			else if (doc) {
                // Folder already exists in the collection, 
                // so insert video files
					
                mpath = path.join(videosPath,folder);
                files = fs.readdirSync(mpath);
                doc.courses = [];
                files.forEach(mp4 => {
                    mp4path = path.join(mpath,mp4);
                    // console.log(` mp4 files ${mp4path}`);
                    if  (fs.lstatSync(mp4path).isFile())
                    {
                        let course = {filename:mp4} 
                        
                        // var subject = new subjectsData();
                        console.log (`inserting ${mp4} ${doc}`);
                        doc.courses.push(course);
                        console.log (`inserting ${mp4} ${doc}`);
                        doc.save()
                        .then(function () {
                            console.log(`${mp4} inserted into ${doc}`);
                        })
                        .catch((err) => {
                            console.log(`error inserting course ${mp4} into ${doc}`)
                        });
                    }

				})
			}
			else {
				
			// subjects to dcollection
				let subject = new subjectsData({name:folder});
				subject.save()
				.then ( () => {
					console.log('subject saved');
					return res.send('subject saved');
                })
                .catch ((err) => {
                    if (err) {
                        console.log('error saving subject');
                        return res.status(404).send('Error saving subject');
                    }
				})  	
			} // end main else
		}) // end of subjectsData.findOne
	}); //end of subjects.forEach
    res.send('Data Loaded');
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