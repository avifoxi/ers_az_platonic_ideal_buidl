gulp_notes.md

https://www.npmjs.com/package/gulp-gm
https://www.npmjs.com/package/gulp-imagemin

http://jshint.com/docs/options/

!!!!
integrate imagemin

FAILING GULP TASKS:
gulp.task('jsonify', function(){
  // var fileContent = 

  // fs.readFile('./source/assets/RefactorTest/courseData/course.js', 'utf8', function(err, data){
  //   if (err){
  //     console.log(err);
  //   }
  //   console.log(data.course);
  var readMe = function(){
    function transform(file, cb) {
      // read and modify file contents
      file.contents = new Buffer(String(file.contents) + ' some modified content');

      // if there was some error, just pass as the first parameter here
      cb(null, file);
    }

    // returning the map will cause your transform function to be called
    // for each one of the chunks (files) you receive. And when this stream
    // receives a 'end' signal, it will end as well.
    // 
    // Additionally, you want to require the `event-stream` somewhere else.
    return eventstream.map(transform);
  }

  // });
  gulp.src('./source/assets/RefactorTest/courseData/course.js')
  .pipe(tap(function(file, t){
    console.log(file)  
  }))
  // var parsed = new Function(fileContent);


  // console.log( 'parsed.course');
  // gulp.src('./source/assets/RefactorTest/courseData/course.js')

})