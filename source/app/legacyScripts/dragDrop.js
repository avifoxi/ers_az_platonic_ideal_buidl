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
	dragSubmits = 0;
	
	$(document).ready(function() {		
		// Store current skeleton width
		contW = $(".container").width();

		// Set up drag drops
		dragDrop();
		dragDropInit();
		$(".buttons .submitAnswer").click(function(e){
			e.preventDefault();
			// If not disabled perform check
			if (!$(this).is(".disabled")) {
				dragSubmits++;
				for (key in dragInput) {
					if (dragInput[key] == dragAnswers[key]) {
						$('#' + key).addClass('correct');
						if ($('.correct').length === dragLength) {
							$('.drag-results').text('That\'s correct. Select the forward arrow to continue.');
							$(".buttons .showAnswer").addClass("disabled");
						}
					} else {
						$('#' + key).addClass('incorrect');
						$('.drag-results').text('That\'s incorrect. Select the Try Again button.');
						$(".buttons .tryAgain").removeClass("disabled");
						if (dragSubmits >= 2) {
							$(".buttons .showAnswer").removeClass("disabled");
						}
					}
				}
			}
		});
		$(".buttons .tryAgain").click(function(e){
			e.preventDefault();
			// If not disabled reset quiz
			if (!$(this).is(".disabled")) {
				//dragInput = new Object();
				$('.drag-results').text('');
				var drags = $(".dragItem");
				var drops = $(".dropItem");
				$('.incorrect').css({
					'top': '0',
					'left': '0'
				});
				$('.incorrect').each(function(i){
					delete dragInput[$(this).attr('id').toString()];
				});
				drags.draggable('destroy');
				drops.droppable('destroy');
				drags.removeClass('incorrect');
				dragDropInit();
				$(".buttons .tryAgain, .buttons .submitAnswer").addClass('disabled');
			}
		});
		$(".buttons .showAnswer").click(function(e){
			e.preventDefault();
			// If not disabled reset quiz
			if (!$(this).is(".disabled")) {
				$('.drag-results').text('The correct answers are shown. Please review all the correct matches. Select the forward arrow to continue.');
				var drags = $(".dragItem");
				var drops = $(".dropItem");
				drags.draggable('destroy');
				drops.droppable('destroy');
				drags.removeClass('incorrect');
				drags.css({
					'top': '0',
					'left': '0'
				});
				for (key in dragAnswers) {
					$('#' + key).offset($('#' + dragAnswers[key] + ' span').offset());
					$('#' + key).addClass('correct');
					$(".buttons .tryAgain, .buttons .submitAnswer, .buttons .showAnswer").addClass('disabled');
				}
			}
		});
	});
	
	// On resize, if a skeleton query is hit, call following functions
	$(window).resize(function(){
		var contC = $(".container").width();
		if (contC != contW) {
			/* PERFORM YOUR TRIGGERED FUNCTIONS */
			$('#lesson_inner, #course_map').hide();
			dragDrop();
		}
		$('#lesson_inner, #course_map').show();
		if (contC != contW) {
			/* PERFORM POSITION BASED TRIGGERED FUNCTIONS */
			droppedUpdate();
			contW = contC;
		}
	});
	
	// Set up drag drops
	function dragDrop() {
		var drags = $(".dragItem");
		var drops = $(".dropItem");
		//drags.attr('style', '');
		var w = drags.width();
		//drags.width(w);
		//drops.find("span").width(w);
	}
	
	// Init drag drops
	function dragDropInit() {
		$( ".dragItem" ).draggable({ 
			revert: "invalid",
			stack: ".dragItem" 
		});
		$( ".dropItem" ).droppable({
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				var dragged = ui.draggable;
				var offs = $(this).find("span").offset();
				dragged.offset(offs);
				// Reactivate previous droppable
				$('#' + dragInput[dragged.attr('id').toString()]).droppable( "option", "disabled", false );
				dragInput[dragged.attr('id').toString()] = $(this).attr('id');
				// Prevent droppable from accepting future drags
				$(this).droppable( "option", "disabled", true );
				var mydrop = $(this);
				if (Object.size(dragInput) === dragLength) {
					$(".buttons .submitAnswer").removeClass("disabled");
				}
			}
		});
	}
	function droppedUpdate() {
		for (key in dragInput) {
			var newoff = $('#' + dragInput[key] + ' span').offset();
			$('#' + key).offset(newoff);
		}
	}
})();