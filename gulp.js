const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
 
gulp.task('default', () =>
    gulp.src('/images/thumbnail/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
);