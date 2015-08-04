var gulp = require('gulp');
var browserify = require('gulp-browserify');
var watchify = require('gulp-watchify')
// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash').assign;
var sass = require('gulp-sass');
var streamify = require('gulp-streamify');

/* 

  JS WATCHIFY / BROWSERIFY FOR DEV BUILD

*/

var filesToCopy = [
  './source/index.html',
  './source/assets/*/*/*'
];

var watching = false
gulp.task('enable-watch-mode', function() { watching = true })

gulp.task('browserify', watchify(function(watchify) {
  return gulp.src('./source/app/REFACTOR.js')
    // .pipe(buffer())
    .pipe(streamify(sourcemaps.init()))
    .pipe(watchify({
        watch:watching
    }))
    .pipe(streamify(sourcemaps.write()))
    .pipe(gulp.dest('./dist/build/'))
}))

gulp.task('watchify', ['enable-watch-mode', 'browserify'])

gulp.task('sass', function () {
  gulp.src('./source/sass/manifest.scss')
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/build/'));
});

gulp.task('watch', function () {
  // ... other watch code ...

  gulp.watch('./source/app/**/*.js', ['watchify']);

  gulp.watch('./source/sass/**/*.scss', ['sass']);

  gulp.watch(filesToCopy, ['copy']);
});




gulp.task('copy', function(){

  gulp.src(filesToCopy, {base: './source'})
  .pipe(gulp.dest('./dist/'));


});

