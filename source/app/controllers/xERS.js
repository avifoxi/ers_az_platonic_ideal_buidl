var $ = require('jquery');
var Audio = require('./media/audio');



var pagesMaster = [];
var pages = [];
var currentPage = 0;
var lessonNumber = 0;
var pageChanging = false;
var pagetype = '';
var devMode = false;

var Course, User;

// Navigation function
function goToPage(){
  Audio.stopAudio('.jp-jplayer');
  // unbind any animations
  $('#lesson_audio').unbind($.jPlayer.event.timeupdate);
  pageChanging = true;
  var nextButton = $("#next_slide");
  $('#glossary_popup').fadeOut();
  // Load the content
  if (currentPage == 'home') {
    checkComplete();
//  checkAssessment();
  $(".map_tile").show();
    $('#lesson_frame').fadeOut(function(e){
      $(this).find('#lesson_inner .content').html('');
    });
    currentPage=0;
  } else {
    // Add loader
  $("#next_slide").addClass("ajax");
    lessonObj = Course[pagetype][lessonNumber];
  // Update lesson header
    $('#lesson_title').text(lessonObj.title);
    $('#screen_title').text(lessonObj.slides[currentPage].title);

    var ajaxTar;
  // Make AJAX request for given page
    if (pagetype=='lessons') {
     ajaxTar= 'lessons/lesson' + lessonNumber + '/page' + currentPage + ".html";
  } else {
      ajaxTar = 'assessments/assessment' + currentPage + ".html";
    }
    $('#lesson_inner .content').fadeOut(function(){
      $(this).hide();
      $.ajax({
        url: ajaxTar,
        dataType: "html",
        cache: false,
        async: false,
        complete: function(jqXHR, textStatus) {
          $("#lesson_frame #lesson_inner .content").html(jqXHR.responseText);
          jpUpdate("#lesson_frame #lesson_inner .content");
          
          $('#lesson_inner .content').fadeIn(function(e){
            // Remove loader
            $("#next_slide").removeClass("ajax");
            // Set slide narration
            if (lessonObj.slides[currentPage].audio !== undefined) {
              // Change narration audio
              Audio.updateAudio('#lesson_audio', 'assets/audio/' + lessonObj.slides[currentPage].audio);
              $('#lesson_frame').removeClass('audioOff');
              Audio.playAudio('#lesson_audio', 'playpause');
            } else {
              $('#lesson_frame').addClass('audioOff');
            }
            //checkThumb(true);
            pageChanging = false;
          });
          // Play glossary term
          $(".glossary_btn").click(function(e){
            e.preventDefault();
            e.stopPropagation();
            if (isPlaying('#lesson_audio')) {
              $('#lesson_audio').jPlayer("pause");
              $('#global_audio').bind($.jPlayer.event.ended + ".jp-wait", function(event) {
                $('#lesson_audio').jPlayer("play");
                $('#global_audio').unbind($.jPlayer.event.ended + ".jp-wait");
              });
            }
            Audio.playAudio('#global_audio', 'restart');
          });
          // Set glossary close button
          $(".closeGlossary").click(function(e){
            e.preventDefault();
            e.stopPropagation();
            $("#glossary_popup").fadeOut();
          });
          
          // If not visible, fade in frame and constrain nav
          if (!$("#lesson_frame").is(":visible")) {
            $("#lesson_frame").fadeIn(function(e){  
              navConstraint();
              $(".map_tile").hide();
            });
          }
          // Mark current lesson/assessment page as read
          if (pagetype!='home') {
            if (pagetype=='lessons') {
              User.suspend_data[pagetype][lessonNumber].slides[currentPage] = true;
            } else if (pagetype=='assessments') {
              User.suspend_data[pagetype][lessonNumber].slides[currentPage].attempted = true;
            }
            User.suspend_data.lesson_location = '0.' + pagetype + '.' + lessonNumber + '.' + currentPage;
          }
          // Load slide required scripts in order
          if (typeof lessonObj.slides[currentPage].requires !== "undefined") {
            for ( var js in lessonObj.slides[currentPage].requires ) {
              var scriptName = lessonObj.slides[currentPage].requires[js];
              $.getScript("scripts/" + scriptName);
            }
          }
          // Check and set lesson/slide progress
          checkComplete();
        }
      });
    });
    // Update nav styles
    $('#lesson_nav ul li span.active').removeClass('active');
    $('#lesson_nav ul li:eq('+currentPage+') span').addClass('active');
    // Check if offset required
    //checkThumb(true);
    
  //disable the prev/next buttons if we are on the first or last page.
    if (currentPage === 0) {
      nextButton.disabled = false;
      nextButton.removeClass('disabled');
      //prevButton.disabled = true;
    } else if (currentPage == (lessonObj.slides.length - 1)) {
      nextButton.disabled = true;
      nextButton.addClass('disabled');
      //prevButton.disabled = false;
    } else {
      nextButton.disabled = false;
      nextButton.removeClass('disabled');
      //prevButton.disabled = false;
    }
  }
}

/*************************/
// Check Completion status
// Check if all slides in a lesson have been viewed, and all lessons in a module
/************************/
function checkComplete() {
  //mark the Course temporarily as completed
  if (User.suspend_data.lesson_status != 'completed' || User.suspend_data.lesson_status != 'passed') {
    User.suspend_data.complete = 'completed';
    for (var _lesson in User.suspend_data.lessons) {
      //mark the current lesson temporarily as complete
      User.suspend_data.lessons[_lesson].complete = true;
      //check each page, and if any are incomplete, change the lesson to incomplete
      for (var _slide in User.suspend_data.lessons[_lesson].slides) {
  if (!User.suspend_data.lessons[_lesson].slides[_slide]) {
    User.suspend_data.lessons[_lesson].complete = false;
  }
      }
      //if the lesson is incomplete, mark the lesson incomplete
      if (!User.suspend_data.lessons[_lesson].complete) {
  User.suspend_data.complete = 'incomplete';
  User.suspend_data.lesson_status = 'incomplete';
  User.lesson_status = 'incomplete';
      }
      //if the lesson is complete, add the green checkbox
      if (User.suspend_data.lessons[_lesson].complete) {
  $('#' + _lesson).addClass('completed');
      } else {
  $('#' + _lesson).removeClass('completed');
      }
    }
    //if the Course is incomplete, disable the knowledge check
    if (User.suspend_data.complete=='incomplete') {
      $('.map_check').addClass('disabled').removeClass('cursor');
    } else {
      $('.map_check').removeClass('disabled').addClass('cursor');
    }
  }
  if (User.lesson_status == 'passed') {
    $('#assessment').addClass('completed');
  } else {
    $('#assessment').removeClass('completed');
  }
  saveUser();
}

function goHome() {
  if (!pageChanging) {
    currentPage='home';
    goToPage();
  }
}

function showHome() {
  $('.map_tile').fadeIn();
  // Start Course slideshows
    $('.slideshow').each(
      function(i) {
        $(this).cycle({
        fx: 'fade',
        delay: Math.floor(Math.random()*4000),
        timeout: 5000,
        speed: 1500
      });
    }
  );
}

function doPrevious(){
  if (!pageChanging) {
    if (currentPage > 0){
      currentPage--;
    }
    goToPage();
  }
}

function doNext(){
  lessonObj = Course[pagetype][lessonNumber];

  if (!pageChanging) {
    if (currentPage < (lessonObj.slides.length - 1)){
      currentPage++;
      checkThumb(true);
    } else {
      goHome();
      return;
    }
    goToPage();
  }
}

function doPage(pgNum){
  if (!pageChanging && currentPage != pgNum) {
    currentPage = pgNum;
    goToPage();
  }
}

function getCourseJSON(url){
  $.getJSON(url, function(res){
    return res;
  }).fail(function(e){
      console.log(e);
      return false;   
  });
}

/*************************/
// Initialize Lesson session
// - generate Course map
// - Initialize LMS session
/*************************/
function doStart(){
  // Load pages array for module via AJAX
    var Course = getCourseJSON('/assets/RefactorTest/CourseData/Course.json');
    

    // Set up modal
    $('#modal_frame .bookmark_buttons .menu').click(function(e){
      pagetype='';
      goHome();
      $('#modal_frame').fadeOut();
      showHome();
    });
    
  //     // Set up Course map page
  //   $("#Course_title").text(Course.title);
  //   document.title = Course.title;
  //   //var maptiles = '<div class="map_row">';
  //   var maptiles = '';
  //   var less = Course.lessons;
  //   for ( var ind in less ) {
  //       maptiles += ' <div class="map_tile map_lesson one-third column cursor" id="' + ind + '">';
  //       maptiles += '   <img src="images/lessoncompletion_check.png" class="completion_check">';
  //       if (less[ind].summary) {
  //         maptiles += '<a href="assets/audio/'+ less[ind].summary +'" class="audio_summary"></a>';
  //     }
  //       maptiles += '   <div class="tile_img slideshow">';
  //       for ( var sli=0; sli < less[ind].thumbnails; sli++ ) {
  //       var classes = sli == 0 ? 'first' : '';
  //       maptiles += '     <img src="lessons/lesson' + ind + '/thumbnails/lesson' + sli + '.png" width="300" height="98" />';
  //       }
  //       maptiles += '   </div>';
  //       maptiles += ' <div class="tile_label">';
  //       maptiles += '   <div class="number">' + (parseInt(ind)+1) + '</div>';
  //       maptiles += '   <div class="title"><p>' + less[ind].title + '</p><span>' + less[ind].time + '</span></div>';
  //       maptiles += '   </div>';
  //       maptiles += ' </div>';
  //   }
  //   //maptiles += '</div>';
    
  //   $('#Course_map').prepend(maptiles);
    
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

// Open lesson to page
function openLesson(lessonNum, pageNum, openType) {
  if (openType == 'lessons') {
    pages = Course.lessons[lessonNum];
  } else if (openType == 'assessments') {
    $('#lesson_frame').removeClass('withnav').addClass('nonav');
    pages = Course.assessments[lessonNum];
  } else {return;}
  currentPage = pageNum;
  pagetype = openType;
  lessonNumber = lessonNum;
  
  buildNav();
  checkThumb(false);
  goToPage();
}

// Build nav for current Pages 
function buildNav() {
  // Fill in nav
  $('#lesson_nav ul').css('left', 0);
  var nav = $('#lesson_nav .thumbnails ul').html('');
  for ( var ind in pages.slides ) {
    var slide = pages.slides[ind];
    if (parseInt(ind) == parseInt(currentPage)) {
      var li = '<li><span class="active" style="background-image: url(\'lessons/lesson' + lessonNumber + '/page' + ind + '.png\');">' + ind + '</span></li>';
    } else {
      var li = '<li><span style="background-image: url(\'lessons/lesson' + lessonNumber + '/page' + ind + '.png\');">' + ind + '</span></li>';
    }
    $(li).appendTo(nav);
  }
  $("#lesson_nav ul li span").click(function(e){
    e.preventDefault();
    e.stopPropagation();
    doPage(parseInt($(this).text()));
  });
  
  // Init draggable nav
  $("#lesson_nav ul").draggable({
    axis: "x",
    disabled: true,
    containment: 'parent'
  });
}

// Set nav constraints
function navConstraint() {
  var navthumbs = $("#lesson_nav ul li");
  var navtwidth = 100;
  var navwidth = navthumbs.length * 100;
  $("#lesson_nav ul").width(navwidth);
  if (navthumbs.length > 8) {
    var allw = 816;
    var navw = 2 * navwidth - allw + 20;
    $("#lesson_nav .nav_wrap").css({
      width: navw + 'px',
      left: ( -(navw-allw)/2 + 72 ) + 'px'
    });
    $("#lesson_nav ul").draggable('option', 'containment', 'parent');
    if (navwidth > $("#lesson_nav").width()) {
      $("#lesson_nav ul").draggable('option', 'disabled', false);
    }
  } else {
    $("#lesson_nav .nav_wrap").css({
      width: 'auto',
      left: '72px'
    });
  }
}

// Ensure active thumb is on screen
function checkThumb(anim) {
  if ( $('#lesson_nav ul li').length > 8 ) {
    var navthumbs = $("#lesson_nav ul li");
    var navtwidth = 100;
    var allw = 816;
    var wrapw = 2 * navthumbs.length * 100 - allw + 20;
    var newoff = (wrapw - allw) / 2 -  currentPage * navtwidth;
    if ( newoff < 0 ) {newoff = 0;}
    //if ( newoff > (wrapw - allw) / 2 - 72 ) {newoff = (wrapw - allw) / 2 + 72;}
    if ( currentPage * navtwidth + parseInt($("#lesson_nav ul").css('left')) > (wrapw + allw - 40) / 2 || currentPage * navtwidth + parseInt($("#lesson_nav ul").css('left')) < (wrapw - allw) / 2 ) {
      if (anim) {
        $('#lesson_nav ul').animate({left: newoff});
      } else {
        $('#lesson_nav ul').css('left', newoff );
      }
    }
  } else {
    $('#lesson_nav ul').css('left', 0 );
  }
}

function showModal(title, content, bookmark, cont) {
  $('#modal_title').text(title);
  $('#modal_inner .modal-cont').html(content);
  if (bookmark) {
    $('#modal_frame .bookmark_buttons').show();
    $('#modal_frame .bookmark_buttons .resume').click(function(e){
      cont();
      $('#modal_frame').fadeOut(function(){$('.map_tile').fadeIn();});
    });
  }
  $('#modal_frame').css('top', ( $('#content').height() / 2 ) - $('#modal_frame').height());
  $('#modal_frame').show();
}

module.exports = {
  pagesMaster: pagesMaster,
  pages: pages,
  currentPage: currentPage,
  lessonNumber: lessonNumber,
  pageChanging: pageChanging,
  pagetype: pagetype,
  devMode: devMode,
  goToPage: goToPage,
  checkComplete: checkComplete,
  goHome: goHome,
  showHome: showHome,
  doPrevious: doPrevious,
  doNext: doNext,
  doPage: doPage,
  doStart: doStart,
  openLesson: openLesson,
  buildNav: buildNav,
  navConstraint: navConstraint,
  checkThumb: checkThumb,
  showModal: showModal
}