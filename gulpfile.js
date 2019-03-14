const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
 
gulp.task('default', () =>
    gulp.src('./public/images/thumbnail/*')
        .pipe(imagemin({
	    progressive: true,	
	    optimizationLevel: 5,
	}))
        .pipe(gulp.dest('dist/images/thumbnail/'))
);
