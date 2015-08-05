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
var jshint = require('gulp-jshint');
var server = require('gulp-server-livereload');
var fs = require('fs');
var jsonlint = require('gulp-jsonlint');
// var eventstream = require('event-stream');


/* 

  JS WATCHIFY / BROWSERIFY FOR DEV BUILD

*/

var filesToCopy = [
  './source/index.html',
  './source/assets/*/*/*',
  './source/assets/*/*/*/*'
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

  gulp.watch('./source/app/**/*.js', ['lint', 'watchify']);
  gulp.watch('./source/sass/**/*.scss', ['sass']);
  gulp.watch(filesToCopy, ['copy']);
  gulp.watch('./source/assets/*/courseData/*.json', ['jsonLint'])
  gulp.watch('./source/app/views/*.html', ['concatViews']);
)
});

gulp.task('concatViews', function(){
  var templates = [
    './source/app/views/*.html',
    './source/app/views/*/*.html'
  ];
  gulp.src(templates)
  // https://www.npmjs.com/package/gulp-template-compile
  .pipe()
})

gulp.task('jsonLint', function(){

  return gulp.src('./source/assets/*/courseData/*.json')
    .pipe(jsonlint())
    .pipe(jsonlint.reporter('jshint-stylish'));
});

gulp.task('lint', function() {
  var lintMeDontLintMe = [
    './source/app/**/*.js',
    '!./source/app/legacyScripts/*',
    '!./source/app/legacyScripts/*/*',
    '!./source/app/legacyScripts/*/*/*'
  ];

  return gulp.src(lintMeDontLintMe)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('copy', function(){
  gulp.src(filesToCopy, {base: './source'})
  .pipe(gulp.dest('./dist/'));
});

gulp.task('serve', ['watch'], function() {
  gulp.src('dist')
    .pipe(server({
      defaultFile: 'index.html',
      livereload: true,
      // directoryListing: true,
      open: true
    }));
});

