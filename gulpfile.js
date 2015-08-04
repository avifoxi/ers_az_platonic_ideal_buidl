var gulp = require('gulp');
var browserify = require('gulp-browserify');
var watchify = require('gulp-watchify')
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash').assign;


/* 

  JS WATCHIFY / BROWSERIFY FOR DEV BUILD

*/

var watching = false
gulp.task('enable-watch-mode', function() { watching = true })

gulp.task('browserify', watchify(function(watchify) {
  return gulp.src('./source/app/REFACTOR.js')
    .pipe(watchify({
        watch:watching
    }))
    .pipe(gulp.dest('./dist/app/'))
}))

gulp.task('watchify', ['enable-watch-mode', 'browserify'])

gulp.task('watch', ['watchify'], function () {
    // ... other watch code ...
})
// gulp.task('watchScripts', function() {
//   gulp.watch('src/**/*.js', ['scripts']);
// });
