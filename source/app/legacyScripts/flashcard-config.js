if (ie8_lower) {
	$('.flashcards').cycle({
		before: function(currSlideElement, nextSlideElement, options, forwardFlag) {
			$(currSlideElement).removeClass('active');
		},
		before: function(currSlideElement, nextSlideElement, options, forwardFlag) {
			$(currSlideElement).removeClass('active');
		},
		fx: 'curtainX', 
		timeout: 0,
		next: '.flashcard',
		speed: 800,
		sync: false,
		nowrap: 1
	});
} else {
	$('.card-q').each(function(i){
		$(this).add($(this).next()).wrapAll('<div class="flipcard" />');
	});
	$('.welcome').click(function(e){
		$(this).fadeOut();
		$(this).next('.flipcard').fadeIn();
	});
	$('.flipcard').click(function(e){
		if ($(this).is('.flipped')) {
			if ($(this).next('.flipcard').length) {
				$(this).fadeOut(function(){
					$(this).next('.flipcard').fadeIn();
				});
			} else {
				$(this).fadeOut(function(){
					$('.finish').fadeIn();
				});
			}
		} else {
			$(this).addClass('flipped');
		}
	});
}