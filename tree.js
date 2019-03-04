const dree = require('dree');
const path = require('path');


// get all video files into array using dree

vidArray = [];
const options = {
  stat: false
};
 
const fileCallback = function (element, stat) {
    vidArray.push(element.path);
  // console.log('Found file named ' + element.path + ' created on ' + stat.ctime);
};

const dirCallback = function (element, stat) {
  // console.log('Found dir named ' + element.name + ' created on ' + stat.ctime);
};
 
folder = './videos'

dree.scan(folder, options, fileCallback, dirCallback);

vidArray.forEach((el,err) => {
    if (err) throw err;
    const ThumbnailGenerator = require('video-thumbnail-generator').default;
    tpath = path.join(__dirname,'../../public/images/thumbnail')
    const tg = new ThumbnailGenerator({
        sourcePath: el,
        thumbnailPath: tpath,
        tmpDir: '/tmp' //only required if you can't write to /tmp/ and you need to generate gifs
    });
    
    
    tg.generateOneByPercent(90,{size:'650x350'})
    .then ( (err,result) => {
        if (err) throw err;
        console.log(result);
    
    })
    .catch ((err)=>{
        console.log(err);
    })

    // smaller version    
    tg.generateOneByPercent(90,{size:'200x200'})
    .then ( (err,result) => {
        if (err) throw err;
        console.log(result);
    
    })
    .catch ((err)=>{
        console.log(err);
    })
    


})

