const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');
const subjectsData = require('../../models/subject');



// List all Courses/subjects and video files under them
router.get('/v1',  (req,res) => {  
    // Use promise
    subjectsData.find({}).sort({name: 'asc'})
    .then((docs)=> {
        if (docs){
            // result = JSON.stringify(docs)
            return res.send(docs)
        }
        return res.json.send({'code':204,'message':'No subject data found'})
        
    })
    .catch((err)=>{
        res.status(500).send('Error with find ')
    })
})

// use /v1 to fetch data and display
router.get('/subjects',  (req,res) => {  
  
fetch('http://localhost:3000/api/v1')
  .then( (response) => {
    
    return response.json();
  })
  .then( myJson => {
    let subjects = []
    
    myJson.forEach(el => {
        subjects.push({"name": el.name})
    });
    
    console.log(JSON.stringify(subjects));
    res.json(subjects);
    
  })
  .catch((err) =>{
      res.status(404).send('Fetch fails')
  })


})
module.exports = router;