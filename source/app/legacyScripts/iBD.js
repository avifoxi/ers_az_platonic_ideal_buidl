// JavaScript Document

/* ========================================================
iBD.js

- The following methods apply specifically to iPhone and 
iPad development.

@auth    William Rust
@created 5-27-10
======================================================== */



/* ========================
 WORKAROUNDS
 ======================== */
/*  
- killTouchMove

iPad and iPhone web broswer and UIwebview allow 
for excess scrolling by default. Apply the following 
method to the shell or main wrapper div to prevent 
scrolling off page.
EX: '<div id="shell" ontouchmove="killTouchMove(event);">' */
function killTouchMove(event){
	//Prevent scrolling on this element
	//event.preventDefault();
}



/* ========================
 GEO LOCATION METHODS
 ======================== */
/*  
- getGeoPosition
Fires request for geolocation on ipad and iphone.

@param callback = the method to be called once the 
geolocation request has completed. */
function getGeoPosition(callback){
	// Get the current location
    navigator.geolocation.getCurrentPosition(callback);
}


/* Here we create a click event and apply it to function (fn) to trick the iPad */
function simulateClick(fn) {
	
	var $a = $('<a href="#" id="simulateClick"></a>');
	$a.bind("click", function(e) {
			e.preventDefault();
			fn();
			});
	
	$("body").append($a);
	
	var evt, el = $("#simulateClick").get(0);
	
	if (document.createEvent) {
		evt = document.createEvent("MouseEvents");
		if (evt.initMouseEvent) {
			evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			el.dispatchEvent(evt);
		}
	}
	
	$(el).remove();
}

/* forceAutoplay is used to start videos without the user clicking play */
function forceAutoplay(targetVideo) {
	
	//alert("forceAutoplay");
	
	var video = $("#"+targetVideo).get(0);
	
	fakeClick(function() {
			  video.play();
			  });
}


function fakeClick(fn) {
	var $a = $('<a href="#" id="fakeClick"></a>');
	$a.bind("click", function(e) {
			e.preventDefault();
			fn();
			});
	
	$("body").append($a);
	
	var evt, 
	el = $("#fakeClick").get(0);
	
	if (document.createEvent) {
		evt = document.createEvent("MouseEvents");
		if (evt.initMouseEvent) {
			evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			el.dispatchEvent(evt);
		}
	}
	
	$(el).remove();
}

// Fires a callback providing a string of 'true' if 
// the asset is in history or 'false' if not and
// adds this asset to the history.
// Can be called on document.ready.
function checkAssetHistory(e){
    // Your callback
	document.location = "iBD:" + "assetInHistory:" + "assetInHistoryCallback";
}
// shows the ISI for the anchor pages if it has not been displayed previously
function assetInHistoryCallback(inHistoryBool){

    if(inHistoryBool == "false"){
        $('#popisi').delay(200).slideToggle(slide_speed, function () {});
    }
}