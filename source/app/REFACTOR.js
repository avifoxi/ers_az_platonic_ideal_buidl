var ERS = require('./controllers/ERS');

window.$ = require('jquery');

$(document).ready(function () {
  ERS.doStart('/assets/RefactorTest/CourseData/Course.json');
});