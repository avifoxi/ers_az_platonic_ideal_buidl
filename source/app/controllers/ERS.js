var $ = require('jquery');
// var Audio = require('./media/audio');



var pagesMaster = [];
var pages = [];
var currentPage = 0;
var lessonNumber = 0;
var pageChanging = false;
var pagetype = '';
var devMode = false;

var Course, User;

var masterController = {};

masterController.goHome = function(){
  console.log('placeholder');
};

masterController.showHome = function(){
  console.log('placeholder');
};

masterController.prepareCourseViews = function(course){
  $("#course_title").text(course.title);
  // Set up Course map page
    document.title = course.title;
    var maptiles = '<div class="map_row">';
    var maptiles = '';
    var less = course.lessons;
    for ( var ind in less ) {
        maptiles += ' <div class="map_tile map_lesson one-third column cursor" id="' + ind + '">';
        maptiles += '   <img src="images/lessoncompletion_check.png" class="completion_check">';
        if (less[ind].summary) {
          maptiles += '<a href="assets/audio/'+ less[ind].summary +'" class="audio_summary"></a>';
      }
        maptiles += '   <div class="tile_img slideshow">';
        for ( var sli=0; sli < less[ind].thumbnails; sli++ ) {
        var classes = sli == 0 ? 'first' : '';
        maptiles += '     <img src="lessons/lesson' + ind + '/thumbnails/lesson' + sli + '.png" width="300" height="98" />';
        }
        maptiles += '   </div>';
        maptiles += ' <div class="tile_label">';
        maptiles += '   <div class="number">' + (parseInt(ind)+1) + '</div>';
        maptiles += '   <div class="title"><p>' + less[ind].title + '</p><span>' + less[ind].time + '</span></div>';
        maptiles += '   </div>';
        maptiles += ' </div>';
    }
    maptiles += '</div>';
    
    $('#course_map').prepend(maptiles);
    
};

masterController.attachListeners = function(){

  $('#modal_frame .bookmark_buttons .menu').click(function(e){
    pagetype='';
    goHome();
    $('#modal_frame').fadeOut();
    showHome();
  });

  //   $('#return_home').click(function(e){
  //     e.preventDefault();
  //     e.stopPropagation();
  //     currentPage = 'home';
  //     goToPage();
  //   });
  //   $('#next_slide').click(function(e){
  //     e.preventDefault();
  //     e.stopPropagation();
  //     doNext();
  //   });
  //   $('.audio_summary').click(function(e){
  //     e.preventDefault();
  //     e.stopPropagation();
  //     // Play linked file
  //     if (!$(this).is('.playing')) {
  //       updateAudio('#global_audio', $(this).attr('href'));
  //     }
  //     $('.audio_summary').not($(this)).removeClass('playing');
  //     $(this).toggleClass('playing');
      
  //     playAudio('#global_audio', 'playpause');
  //   });
  //   $('.map_lesson').click(function(e){
  //     e.preventDefault();
  //     e.stopPropagation();
  //     // Load appropriate lesson from master
  //     lessonNumber = $(this).attr('id');
  //     $('#lesson_frame').removeClass('nonav').addClass('withnav');
  //     openLesson(lessonNumber, 0, 'lessons');
  //     stopAudio('#global_audio');
  //   });
  //   $('#lesson_frame .close_button').click(function(e){
  //     e.preventDefault();
  //     e.stopPropagation();
  //     currentPage = 'home';
  //     goToPage();
  //   });
};

masterController.doStart = function (courseUrl){
  // Load pages array for module via AJAX
    var course;
    var self = this;
    this.attachListeners();


    $.getJSON(courseUrl, function(res){
      self.prepareCourseViews(res);
    }).fail(function(e){
      console.log('Error!')
    });
  
  //   // Begin activity
  //   $('.map_check').click(function(e){
  //     e.preventDefault();
  //     e.stopPropagation();
  //     if (!$(this).is('.disabled')) {
  //       // Load appropriate assessment from master
  //       //lessonNumber = $(this).attr('id');
  //       lessonNumber = 0;
  //       openLesson(lessonNumber, 0, 'assessments');
  //     }
  //   });
  //   if (devMode) {
  //     $('.dev-bar').show()
  //     $('.dev-bar .clear-cookies').click(function(e){
  //       e.preventDefault();
  //       e.stopPropagation();
  //       $.jCookies({ erase : Course.identifier });
  //       goHome();
  //     });
  //   }
    
  //   // Load references
  //   $('#ref_inner .col-cont').load(Course.references.path + '.html');
  //   $('.map_ref').click(function(e){
  //     $('#ref_frame').fadeIn();
  //   });
  //   $('#ref_frame .close_button').click(function(e){
  //     $('#ref_frame').fadeOut();
  //   });
    
  //   //initialize communication with the LMS
  //   ScormProcessInitialize();
  //   loadUser();
  //   startTimeStamp = new Date();
  // }).fail(function(jqxhr, settings, exception) {
  //   // trace("Error loading configuration file");
  // });
}

module.exports = masterController;