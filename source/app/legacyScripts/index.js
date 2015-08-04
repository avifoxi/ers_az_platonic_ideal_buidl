function summary(audio, elm) {
	if (audio) {
		if ($(elm).hasClass('playing')) {
			$(elm).removeClass('playing').addClass('paused');
			$('#global_audio').jPlayer('pause');
		} else if ($(elm).hasClass('paused')) {
			$(elm).removeClass('paused').addClass('playing');
			$('#global_audio').jPlayer('play');
		}
		else {
			updateAudio('#global_audio', 'assets/' + audio);
			$('.audio_summary').not(elm).removeClass('paused playing');
			$(elm).addClass('playing');
			$('#global_audio').jPlayer('play');
		}
	}
}
