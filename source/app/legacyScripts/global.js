var hasMXEngage = false;
var is_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
if (is_uiwebview) {
  hasMXEngage = true;
} else {
}

function openPDF( _pdf, lessonDir ) {
//	window.open(_pdf, "_blank", "width=600, height=600, scrollbars=1, resizable=1");

	//open PDF based on whether the user is in MXEngage or not

	if (hasMXEngage == false) {
		window.open(_pdf, "_blank", "width=600, height=600, scrollbars=1, resizable=1");
	} else {
		document.location = 'iBD:showPdfViewer:pages/' + lessonDir + '/' + _pdf + ':FOR INTERNAL TRAINING USE ONLY. NOT FOR USE IN A SELLING SITUATION.';
	}
	/* document.location = 'iBD:showPdfViewer:' + _pdf + ':FOR INTERNAL TRAINING USE ONLY. NOT FOR USE IN A SELLING SITUATION.'; */
}

// Adding custom size function for object measurement
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


// Start slideshows for lessons with random delay
(function(){
	var contW;
	var orientation;
	orientation="landscape";
		
	$(document).ready(function() {		
		// Init global audio player
		var globalAudio = genAudio('global_audio', '', '#global_audio_box');
		globalAudio.jPlayer({
			ready: function (event) {
				$(this).jPlayer("setMedia", {
					mp3:"assets/silence.mp3"
				});
			},
			swfPath: "scripts/jPlayer",
			supplied: "mp3",
			wmode: "window"
		});
		globalAudio.bind($.jPlayer.event.ended, function(event) {
			$('.audio_summary.playing').removeClass('playing');
		});
		
		// Init lesson narration player
		var narrAudio = genAudio('lesson_audio', '#lesson_narration', '#global_audio_box');
		$('#lesson_audio').jPlayer({
			ready: function (event) {
				$(this).jPlayer("setMedia", {
					mp3:"assets/silence.mp3"
				});
			},
			swfPath: "scripts/jPlayer",
			cssSelectorAncestor: "#lesson_narration .jp-audio",
			supplied: "mp3",
			wmode: "window"
		});
		pauseOthers(narrAudio);
	});
	
})();

function loadLesson(lesson) {
	// Temporary simple link script for loading a "lesson" page
	window.location = lesson;
}

function glossary(title, text, audio, elm) {
	if ($("#glossary_popup").is(":visible")) {
		$("#glossary_popup").fadeOut( function(e) {
			swapGlossary(title, text, audio, elm);
		});
	} else {
		swapGlossary(title, text, audio, elm);
	}
	
}
function swapGlossary(title, text, audio, elm) {
	$("#glossary_popup .definition_text").text(text);
	$("#glossary_popup .popupTitle").text(title);
	if (audio) {
		$("#glossary_popup .glossary_btn").show();
		updateAudio('#global_audio', 'assets/glossary/' + audio);
	} else {$("#glossary_popup .glossary_btn").hide();}
	// var myelm = $(elm);
	// var offer = myelm.offset();
	// if (offer.left + 300 > 1040) {offer.left = 740;}
	// $("#glossary_popup").css({
	// 	'left': offer.left + 'px',
	// 	'top': (offer.top + 22) + 'px'
	// });
	var offer = $("#lesson_narration").offset(); // adjust the glossary for video conflict
	var myelm = $("#glossary_popup").css({display: 'block', opacity: 0});
	var elmHeight = myelm.height();
	myelm.css({
		left: (offer.left + 10) + 'px',
		top: (offer.top - elmHeight - 10) + 'px'
	});
	myelm.animate({opacity: 1}, 400);
}

// jPlayer helper functions
function isPlaying(audioPlayer) {
	return !$(audioPlayer).data().jPlayer.status.paused;
}

// Play global player with options: 'playpause', 'restart' or 'wait'
function playAudio(audioPlayer, option) {
	if (!$(audioPlayer).length)
		return;
	var paused = !isPlaying(audioPlayer);
	switch (option) {
		case 'playpause':
			// if playing, pause and vice versa
			if (paused) {
				$(audioPlayer).jPlayer("play");
			} else {
				$(audioPlayer).jPlayer("pause");
			}
			break;
		case 'restart':
			// if playing, restart clip
			$(audioPlayer).jPlayer("play", 0);
			break;
		case 'wait':
			// if playing, do nothing, else play
			if (paused) {
				$(audioPlayer).jPlayer("play");
			} else {
				return;
			}
			break;
		default:
			// default to play pause
			// if playing, pause and vice versa
			if (paused) {
				$(audioPlayer).jPlayer("play");
			} else {
				$(audioPlayer).jPlayer("pause");
			}
			break;
	}
}

function stopAudio(audioPlayer) {
	$(audioPlayer).jPlayer("stop");
	if (audioPlayer === '#global_audio') {
		$('.audio_summary.playing').removeClass('playing');
	}
}

function updateAudio(audioPlayer, audioFile) {
	$(audioPlayer).jPlayer("setMedia", {
		mp3: audioFile + ".mp3"
	});
}

function trace(s) {
	try { console.log(s) } catch (e) { alert(s) }
}

function pauseOthers(audioPlayer) {
	$(audioPlayer).bind($.jPlayer.event.play, function() { // Bind an event handler to the instance's play event.
		$(this).jPlayer("pauseOthers"); // pause all players except this one.
	});
}