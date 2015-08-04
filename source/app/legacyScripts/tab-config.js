$( "#tabs" ).tabs({
	beforeActivate: function(e, u) {
		if ($("#glossary_popup").is(":visible")) {
			$("#glossary_popup").fadeOut();
		}
		stopAudio('#lesson_inner .jp-jplayer');
		if (hasMXEngage === true) {
			$('#lesson_inner video').each(function() {
				this.pause();
			});
		}
	}
});