// Set Video Duration in proper place

function setDuration(indx) {  
 // var vidTag = document.querySelectorAll('video');
  // vidTag.forEach((val,index) => {
      
  var dur = document.getElementById('video-'+ indx).duration;
  duration = (dur/60).toFixed(2);
  
  document.getElementById('vid-'+ indx).textContent = duration + " mins";

    //});
}

function playVideo(selectid) {
  let video = "";
  
  video = document.getElementById('videoid');
  
  let videotext = document.getElementById('videotitle');
  // pick the id element of the select tag as folder
  let folder = document.querySelector('select').id;
  // console.log(`x is ${x.id}`);
  
  let selected = selectid.value;
 
  videotext.innerText = selected.substring(0, selected.lastIndexOf('.'));
  selected = '/' + folder + '/' + selected;
  // console.log(`select id is ${selectid} selected is ${selected}`);
  // set text for video Title
  console.log(`selected id is ${selected} `); 
  // var source = document.createElement('source');
  
  //source.setAttribute('src', selected);
  
  // video.appendChild(source);
  video.src = selected;
 
  video.load();
  
  // document.getElementById(selectid).onclick = function(){
  video.play();
  let dur = video.duration;
  document.getElementById('vid-0').textContent = (dur/60).toFixed(0) + " mins";
  
  console.log(`current video url is ${video.currentSrc}`);
  // }
  
}


function playcVideo2(selectid) {
  let video = "";
  console.log(`play value is ${selectid}`);

  video = document.getElementById('videoid');
  
  let videotext = document.getElementById('videotitle');
  // pick the id element of the select tag as folder
  let folder = document.querySelector('h5').id;
  // console.log(`x is ${x.id}`);
  
  let selected = selectid;
  
  videotext.innerText = selected.substring(0, selected.lastIndexOf('.'));
  selected = '/' + folder.toLowerCase() + '/' + selected;
  // console.log(`select id is ${selectid} selected is ${selected}`);
  // set text for video Title
  // console.log(`selected url is ${selected} `); 
  var source = document.createElement('source');
  
  //source.setAttribute('src', encodeURI(selected));
  
  //video.appendChild(source);
  video.src = encodeURI(selected);
 
  video.load();
  
  // document.getElementById(selectid).onclick = function(){
  video.play();
  let dur = video.duration;
  document.getElementById('vid-0').textContent = (dur/60).toFixed(0) + " mins";
  document.getElementById('videoid').focus();
  // console.log(`current video src is ${video.currentSrc}`);
  
  // }
  
}


// Handlebars helperS
// substr to decorate string

