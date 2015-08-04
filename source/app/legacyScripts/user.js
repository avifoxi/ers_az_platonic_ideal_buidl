/*************************/
// Store User object
// Store settings in cookie and LMS
// TODO: Make it work
/*************************/
function saveUser() {
  if (API) {
    // Parse user object and save to LMS
    API.LMSSetValue("cmi.core.lesson_status", user.suspend_data.lesson_status);
    API.LMSSetValue("cmi.core.lesson_location", user.suspend_data.lesson_location);
    API.LMSSetValue("cmi.suspend_data",  progressToString() );
    if ( (user.lesson_score!="") && (user.lesson_score!=null) ) {
      API.LMSSetValue("cmi.core.score.raw", user.lesson_score);
    }
  }
  // Parse user object and save to cookie (should always perform this so that mxEngage can track user data- though it only persists per session)
  var _cookie = {};
  _cookie.lesson_status = user.suspend_data.lesson_status;
  _cookie.lesson_location = user.suspend_data.lesson_location;
  _cookie.suspend_data = progressToString();
  _cookie.lesson_score = user.suspend_data.lesson_score;
  _cookie.complete = user.suspend_data.complete;
  $.jCookies({	name : course.identifier, value : _cookie });
}

/************************/
// Convert suspend_data to string for storage in cookie/LMS
/************************/
function progressToString() {
  var _progress = "";
    _progress += "@";
    for (var _lesson in user.suspend_data.lessons) {
      _progress += "|";
      for (var _slide in user.suspend_data.lessons[_lesson].slides) {
        if (user.suspend_data.lessons[_lesson].slides[_slide]) {
	  _progress += "1";
        } else {
	  _progress += "0";
        }
      }
    }
    for (var _assessment in user.suspend_data.assessments) {
      _progress += "#";
      for (var _slide in user.suspend_data.assessments[_assessment].slides) {
       	_progress += "|";
  	if (user.suspend_data.assessments[_assessment].slides[_slide].attempted==true) {
	  _progress += "1";
        } else {
	  _progress += "0";
        }
	if (user.suspend_data.assessments[_assessment].slides[_slide].passed=='passed') {
	  _progress += "1";
	} else {
	  _progress += "0";
        }
      }
    }
//  _progress += "#" + user.suspend_data.assessmentAttempts + "--" + user.suspend_data.assessmentPassed;
  return _progress;
}

/************************/
// Convert progress string to suspend_data object
/************************/
function stringToProgress( _string ) {
  var _course = _string.split("@");
  _course.shift();
  var _lessonData = _course[0].split("#");
  var _lessons = _lessonData[0].split("|");
  var _assessments = _lessonData[1].split("|");
  _lessons.shift();
  _assessments.shift();
  for (var _lesson=0; _lesson<_lessons.length; _lesson++) {
    if (_lesson==0) {
 //     continue;
    }
    var _tempLesson = _lessons[_lesson];
    _lessons[_lesson] = [];
    if (typeof _tempLesson != 'string') continue;
    _lessons[_lesson].slides = _tempLesson.split("");
    _lessons[_lesson].complete = false;
    for (var _slide=0; _slide<_lessons[_lesson].slides.length; _slide++) {
      if (_lessons[_lesson].slides[_slide] == "0") {
        _lessons[_lesson].slides[_slide] = false;
      } else {
        _lessons[_lesson].slides[_slide] = true;
      }
    }
  }
  for (var _assessment=0; _assessment<_assessments.length; _assessment++) {
    var _tempAssessment = _assessments[_assessment].split("");
    _assessments[_assessment] = [];
    _assessments[_assessment].slides = [];
    _assessmentData = _tempAssessment;
    for (var _slide=0; _slide<_assessments.length; _slide++) {
      _assessments[_assessment].slides[_slide] = [];
      _assessments[_assessment].slides[_slide].attempted = _assessmentData[0];
      if (_assessmentData[1]==1) {
	_assessments[_assessment].slides[_slide].passed = 'passed';
      } else {
	_assessments[_assessment].slides[_slide].passed = 'failed';
      }
    }
  }
  user.suspend_data = [];
  //user.suspend_data.lesson_status = 'incomplete';
  user.suspend_data.lesson_status = user.lesson_status;
  user.suspend_data.lessons = _lessons;
  user.suspend_data.assessments = _assessments;
}

/*************************/
// Load User object
// Load settings in cookie and LMS
/*************************/
function loadUser() {
  if (API) {
    user.name = API.LMSGetValue("cmi.core.student_name");		
    user.lesson_status = API.LMSGetValue("cmi.core.lesson_status");
    user.lesson_location = API.LMSGetValue("cmi.core.lesson_location");
    if (!API.LMSGetValue("cmi.suspend_data")) {
      user.suspend_data=false;
    } else {
      stringToProgress(API.LMSGetValue("cmi.suspend_data"));
    }
  } else {
    var _cookie = $.jCookies({get : course.identifier });
      if (!_cookie) {
      } else {
      	user = _cookie;
		user.suspend_data.lesson_status = user.lesson_status;
		stringToProgress(_cookie.suspend_data);
      }
  }
  
	// Check if this is the first time the user has logged in and viewed the course
	if ( (user.lesson_status == "completed") || (user.lesson_status == "incomplete") || (user.lesson_status == "failed") ) {
		if (user.lesson_location === "" || typeof user.lesson_location == "undefined") {
			pagetype='';
			goHome();
			showHome();
			saveUser();
		} else {
			var modalContent = '<p>Welcome back to <b>' + course.title + '</b>.</p><p>If you would like to return to here you left off, select the Resume button.</p><p>Select the Menu button if you would like to start at the Menu.</p>';
			showModal('Bookmark', modalContent, true, function(e){
				var location = user.lesson_location.split('.');
				openLesson(parseInt(location[2]), location[3], location[1]);
				showHome();
			});
		}
	}
	else if (user.lesson_status == "passed") {
		var modalContent = '<p>You have completed the <strong>' + course.title + '</strong> course.</p>';
		showModal('Complete', modalContent, true, function(e){showHome();});
		$('#modal_content .content_btn.resume').hide();
		pagetype='';
		goHome();
		showHome();
		//saveUser();
	}
	else {
		populateUser();
		pagetype='';
		goHome();
		showHome();
		saveUser();
	}
}

/***********************/
// Populate User object
// Create structure for user object to store location, status, assessment data
/***********************/
function populateUser () {
  var _suspend_data = [];
  _suspend_data.lessons = [];
  _suspend_data.assessments = [];
  for (var _lesson=0; _lesson<course.lessons.length; _lesson++) {
    var _lessonObj = course.lessons[_lesson];
      _suspend_data.lessons[_lesson] = [];
      _suspend_data.lessons[_lesson].slides = [];
      _suspend_data.lessons[_lesson].complete = false;
      for (var _slide=0; _slide<_lessonObj.slides.length; _slide++) {
        _suspend_data.lessons[_lesson].slides[_slide] = false;
      }
  }
  for (var _assessment=0; _assessment<course.assessments.length; _assessment++) {
    var _assessObj = course.assessments[_assessment];
    _suspend_data.assessments[_assessment] = [];
    _suspend_data.assessments[_assessment].passed = false;
    _suspend_data.assessments[_assessment].attempts = 0;
    _suspend_data.assessments[_assessment].attempted = 'not attempted';
    _suspend_data.assessments[_assessment].slides = [];
    _suspend_data.assessments[_assessment].score = 0;
    for (var _slide in _assessObj.slides) {
      _suspend_data.assessments[_assessment].slides[_slide] = [];
      _suspend_data.assessments[_assessment].slides[_slide].attempted = false;
      _suspend_data.assessments[_assessment].slides[_slide].score = '';
      _suspend_data.assessments[_assessment].slides[_slide].passed = false;
    }
  }

  _suspend_data.complete = false;
  user.lesson_score = 0;
  user.suspend_data = _suspend_data;
}
