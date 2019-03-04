const ThumbnailGenerator = require('video-thumbnail-generator').default;
 
const tg = new ThumbnailGenerator({
  sourcePath: '/Users/admin/prod/tor-schapp-hbs/videos/nursery/Math Antics - Basic Division-KGMf314LUc0.mp4',
  thumbnailPath: '/Users/admin/prod/tor-schapp-hbs/public/images/thumbnail/',
  tmpDir: '/tmp' //only required if you can't write to /tmp/ and you need to generate gifs
});
 
tg.generate()
  .then(console.log);
