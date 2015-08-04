/*!
 * SlickQuiz jQuery Plugin
 * http://github.com/QuickenLoans/SlickQuiz
 *
 * @updated December 18, 2010
 *
 * @author Julie Bellinson - http://www.jewlofthelotus.com
 * @copyright (c) 2012 Quicken Loans - http://www.quickenloans.com
 * @license MIT
 */

(function($){
	$.categoryQuiz = function(element, options) {
		var $element = $(element),
 			element = element;

		var plugin = this;

		var defaults = {
			randomSort: false,
			randomSortQuestions: false,
			preventUnanswered: false,
			completionResponseMessaging: false,
			disableResponseMessaging: false
		};

		plugin.config = $.extend(defaults, options);

		var selector = $(element).attr('id');

		var triggers = {
			starter: 		'#' + selector + ' .startQuiz',
			retry:   		'#' + selector + ' .retryQuiz',
			checker: 		'#' + selector + ' .checkAnswer',
			category:		 '#' + selector + ' .button.category'
		}

		var targets = {
			quizName:		'#' + selector + ' .quizName',
			quizArea:		'#' + selector + ' .quizArea',
			quizResults: 	'#' + selector + ' .quizResults',
			quizHeader:  	'#' + selector + ' .quizHeader',
			quizDesc:		'#' + selector + ' .quizDesc',
			quizScore:   	'#' + selector + ' .quizScore',
			quizTime:		'#' + selector + ' .quizTime',
			quizButtons: 	'#' + selector + ' .button.category'			
		}

		// Set via json option or quizJSON variable (see slickQuiz-config.js)
		var quizValues = (plugin.config.json ? plugin.config.json : typeof quizJSON != 'undefined' ? quizJSON : null);

		var questions = quizValues.questions;

		// Count the number of questions
		var questionCount = questions.length;
		
		// Player score
		var score = 0;
		
		// Timer
		var origSeconds = 90;
		var totalSeconds = origSeconds;
		var timerStarted = false;
		
		var quizComplete = false;

		plugin.method = {
			// Sets up the questions and answers based on above array
			setupQuiz: function() {
				var headerbar = '<div class="header_bar">';
					headerbar += '<div class="title">' + quizValues.info.name + '</div>';
					headerbar += '<div class="quizTime">0:00</div>';
					headerbar += '<div class="quizScore">0 points</div>';
				headerbar += '</div>';
				$(targets.quizHeader).hide().prepend(headerbar).fadeIn(1000);

				var minutes = Math.floor( totalSeconds / 60 );
				var seconds = totalSeconds % 60 < 10 ? '0' + totalSeconds % 60 : totalSeconds % 60 ;
				$(targets.quizTime).text( minutes + ":" + seconds );

				// Setup questions
				var quiz  = $('<ol class="questions"></ol>'),
					count = 1;
					
				// Loop through categories and generate reusable links
				var categories = quizValues.categories;
				var categoryHTML = "<table><tbody><tr>";
				for (cat in categories) {
					categoryHTML += "<td align='center'><a class='button category disabled' href='"+cat+"'>";
					categoryHTML += categories[cat];
					categoryHTML += "</a></td>";
				}
				categoryHTML += "</tr></tbody></table>";

				// Loop through questions object
				for (i in questions) {
					if (questions.hasOwnProperty(i)) {
						var question = questions[i];

						var questionHTML = $('<li class="question" id="question' + (count - 1) + '" style="display: none;"></li>');
						questionHTML.append('<p class="questionText">' + question.q + '</p>');

						// prepare a name for the answer inputs based on the question
						var inputName  = 'question' + (count - 1);

						// Append answers to question
						//questionHTML.append(categoryHTML);

						// If response messaging is NOT disabled, add it
						if (!plugin.config.disableResponseMessaging) {
							// Now let's append the correct / incorrect response messages
							var responseHTML = $('<div class="responses"></div>');
							responseHTML.append('<div class="correct">' + question.correct + '</div>');
							responseHTML.append('<div class="incorrect">' + question.incorrect + '</div>');

							// Append responses to question
							questionHTML.append(responseHTML);
						}

						// Append question & answers to quiz
						quiz.append(questionHTML);

						count++;
					};
				};
				
				quiz.append("<li class='quizDesc'><div>" + quizValues.info.main + '</div><a class="startQuiz button" href="">Get Started!</a></li>');
				quiz.append('<li class="quizResults"><div class="success" style="display: none;">' + quizValues.info.success + '</div><div class="failure" style="display: none;">' + quizValues.info.failure + '</div><a class="retryQuiz button" href="">Retry</a></li>');
				// Add the quiz content to the page
				$(targets.quizArea).append(quiz);
				// Add footer
				$(targets.quizArea).append('<div class="footer_bar"></div>');
				// Add category selection
				$(targets.quizArea).append(categoryHTML);
				// Toggle the start button
				$(triggers.starter).fadeIn(500);
			},

			// Starts the quiz (hides start button and displays first question)
			startQuiz: function(startButton) {
				$(targets.quizScore).text(score * 10 + ' points');
				plugin.method.startTimer();
				$(targets.quizButtons).removeClass('disabled');
				$(startButton).add(targets.quizDesc).fadeOut(300, function(){
					var firstQuestion = $('#' + selector + ' .questions li').first();
					firstQuestion.addClass('active');
					if (firstQuestion.length) {
						firstQuestion.fadeIn(300);
					}
				});
			},

			// Validates the response selection(s), displays explanations & next question button
			checkAnswer: function(checkButton) {
				if ($(checkButton).is('.disabled')) {
					return;
				}
				var questionLI   = $(targets.quizArea).find('li.question.active'),
					answers  	= questions[parseInt(questionLI.attr('id').replace('question', ''))].a,
					userinput	= parseInt($(checkButton).attr('href'));
				if (questionLI.length) {
					$(targets.quizArea + ' .question').removeClass('active');
					$(targets.quizButtons).addClass('disabled');
					var correctResponse = userinput === answers;
	
					// If response messaging hasn't been disabled, toggle the proper response
					if (!plugin.config.disableResponseMessaging) {
						// If response messaging hasn't been set to display upon quiz completion, show it now
						if (!plugin.config.completionResponseMessaging) {
							questionLI.find('.responses').show();
						}
	
						// Toggle responses based on submission
						questionLI.find('.questionText').fadeOut(200, function(e){
							if (!quizComplete) {
								if (correctResponse) {
									questionLI.addClass('completed');
									questionLI.find('.correct').fadeIn(200);
									score++;
									$(targets.quizScore).text(score * 10 + ' points');
								} else {
									questionLI.find('.incorrect').fadeIn(300);
								}
							}
						});
						setTimeout(function(){
							if (!quizComplete) {
								questionLI.fadeOut(200, function(e){
									$(this).find('.correct').hide();
									$(this).find('.incorrect').hide();
									$(this).find('.questionText').show();
									var currentQuestion = questionLI,
										nextQuestion	= currentQuestion.next('.question:not(.completed)');
									// If no next question, default to first incomplete question
									if (!nextQuestion.length) {
										nextQuestion = $(targets.quizArea).find('li.question:not(.completed)').eq(0);
									}
									if (nextQuestion.length) {
										nextQuestion.addClass('active');
										questionLI.find('.correct, .incorrect').fadeOut(0);
										nextQuestion.fadeIn(500);
										$(targets.quizButtons).removeClass('disabled');
									} else {
										plugin.method.completeQuiz(false);
									}
								});
							}
						}, 2000);
					}
				}
			},

			// Hides all questions, displays the final score and some conclusive information
			completeQuiz: function(timedout) {
				$(targets.quizButtons).addClass('disabled');
				quizComplete = true;
				$(targets.quizArea + ' li.question').stop().removeClass('active completed')
				var lastQ = $(targets.quizArea + ' li.question:visible');
				var showResults = function() {
					if (timedout) {
							$(targets.quizResults + ' .failure').show();
						} else {
							$(targets.quizResults + ' .success').show();
						}
						$(targets.quizResults).fadeIn(500);
				};
				if (lastQ.length) {
					lastQ.fadeOut(300, function() {
						showResults();
					});
				} else {
					showResults();
				}
			},
			
			// Initialize timer
			startTimer: function() {
				var Tick = function() {
					totalSeconds -= 1;
					if (quizComplete || $(targets.quizResults).is(':visible')) {return;}
					if (totalSeconds <= 0) {
						$(targets.quizTime).text( "0:00" );
						plugin.method.completeQuiz(true);
					} else {
						// Update timer
						var minutes = Math.floor( totalSeconds / 60 );
						var seconds = totalSeconds % 60 < 10 ? '0' + totalSeconds % 60 : totalSeconds % 60 ;
						$(targets.quizTime).text( minutes + ":" + seconds );
						window.setTimeout(Tick, 1000);
					}
				}
				
				if (!timerStarted) {
					timerStarted = true;
					window.setTimeout(Tick, 1000);
				}
			}
		}

		plugin.init = function() {
			// Setup quiz
			plugin.method.setupQuiz();

			// Bind "start" button
			$(triggers.starter).click(function(e) {
				e.preventDefault();
				plugin.method.startQuiz(this);
			});
			
			// Bind "retry" button
			$(triggers.retry).click(function(e) {
				e.preventDefault();
				$(targets.quizResults).fadeOut(300, function(e) {
					score = 0;
					totalSeconds = origSeconds;
					timerStarted = false;
					quizComplete = false;
					$(targets.quizArea + ' li.question').removeClass('completed');
					plugin.method.startQuiz(this);
				});
			});
			
			// Bind category buttons
			$(triggers.category).click(function(e) {
				e.preventDefault();
				plugin.method.checkAnswer(this);
			});

			
		}

		plugin.init();
		if (options.autostart) {
			$(triggers.starter).click();
		}
	}

	$.fn.categoryQuiz = function(options) {
		return this.each(function() {
			if (undefined == $(this).data('categoryQuiz')) {
				var plugin = new $.categoryQuiz(this, options);
				$(this).data('categoryQuiz', plugin);
			}
		});
	}
})(jQuery);
