const dree = require('dree');
const path = require('path');
const thumb = require('video-thumbnail')


tpath = path.join(__dirname,'public/images/thumbvideo/');
console.log(tpath)
// get all video files into array using dree

const options = {
  stat: false,
  extensions: ['mp4']
};
 
createThumbVideo = (el) => {

	el = el.replace(' ','\ ')
	tpath = tpath.replace(' ','\ ')
	thumb.video(el, tpath, {width: 200, silent:true}).then(()=>{
   		 console.log('Done!')
	}).catch((err)=>{
    		console.log(err)
	})
    console.log('processing '+el);
}

const fileCallback = function (element, stat) {
    createThumbVideo(element.path);
  // console.log('Found file named ' + element.path + ' created on ' + stat.ctime);
};

const dirCallback = function (element, stat) {
  // console.log('Found dir named ' + element.name + ' created on ' + stat.ctime);
};
 
folder = './videos/angular'

dree.scan(folder, options, fileCallback, dirCallback);


 
