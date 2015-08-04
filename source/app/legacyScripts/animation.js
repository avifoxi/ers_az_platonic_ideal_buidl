$(document).ready(function(){

	/*

	 * jQuery UI ThemeRoller

	 *

	 * Includes code to hide GUI volume controls on mobile devices.

	 * ie., Where volume controls have no effect. See noVolume option for more info.

	 *

	 * Includes fix for Flash solution with MP4 files.

	 * ie., The timeupdates are ignored for 1000ms after changing the play-head.

	 * Alternative solution would be to use the slider option: {animate:false}

	 */

	var audio = $('#lesson_audio');
	// init elements
	initElements();
	// bind palyback
	audio.bind($.jPlayer.event.timeupdate, function(event) {
		checkTimecode(event);
	});
							
	var time;
	var lastframe;
	// an array of keyframes
	var keys = [];
	for (var i in keyframes) {
		if (keyframes.hasOwnProperty(i)) {
			keys.push(i);
		}
	}
	var v;
	
	function initElements() {
		for (var k in keyframes[0]) {
			if (keyframes[0][k].x === 'auto' || keyframes[0][k].y === 'auto') {
				$(k).css({
					'position': 'relative',
					'left': keyframes[0][k].x,
					'top': keyframes[0][k].y,
					'opacity': keyframes[0][k].a
				});
			} else {
				$(k).css({
					'position': 'absolute',
					'left': keyframes[0][k].x,
					'top': keyframes[0][k].y,
					'opacity': keyframes[0][k].a
				});
			}
		}
	}
	
	
	function checkTimecode(event) {
		// pulls the current time from jPlayer.
		time = event.jPlayer.status.currentTime.toFixed (1);
		
		// creates an integer for the current Time Code
		var tc = Math.floor(time);
		
		// Stops animation from checking more than once a second
		if (!(lastframe == tc)) {
			// if there is no keyframe at current tc, loop references previous keyframe for positions
			if (typeof keyframes[tc] === "undefined") { 
				v = keys.length - 1;	
				while (keys[v] > tc) {
					v--;
				}
				for (var k in keyframes[keys[v]]) {
					var obj = keyframes[keys[v]][k];
					if (obj.x === "auto" || obj.y === "auto") {
						$(k).stop(true,true).css({'opacity': obj.a});
					} else {
						if (!($(k).position.left == obj.x && $(k).position.top && obj.y && $(k).css('opacity') == obj.a)) {
							$(k).stop(true,true).css({'left': obj.x, 'top': obj.y, 'opacity': obj.a});
						}
					}
				}
				lastframe = tc;
			}
			else {
				for (var k in keyframes[tc]) {
					var obj = keyframes[tc][k];
					if (obj.x === "auto" || obj.y === "auto") {
						$(k).stop(true,true).animate({'opacity': obj.a}, obj.anim);
					} else {
						if (!($(k).position.left == obj.x && $(k).position.top == obj.y)) {
							$(k).stop(true,true).animate({'left': obj.x, 'top': obj.y, 'opacity': obj.a}, obj.anim);
						}
					}
				}
				lastframe = tc;
			}
		}
	}
});