// Setup your quiz text and questions here

// NOTE: pay attention to commas, IE struggles with those bad boys

var quizJSON = {
    "info": {
        "name":    "Category Clicker",
        "main":    "<p>Welcome to the Category Clicker game.</p><p>For each statement, select the button corresponding to the best answer.</p><p>Select the Start button to begin</p>",
        "success": "<p>Congratulations!</p><p>You have correctly categorized all of the items.</p><p>Select the Retry button to play the game again, or go to the main menu to access other modules and support material.</p>",
        "failure": "<p>Time's up!</p><p>You ran out of time before you could categorize all of the items.</p><p>Select the Retry button to play the game again, or go to the main menu to access other modules and support material.</p>"
    },
    "categories" : [
    	"Letter",
    	"Number",
    	"Other"
    ],
    "questions": [
        {
            "q": "A",
            "a": 0,
            "correct": "<p>Correct</p>",
            "incorrect": "<p>Incorrect</p>"
        },
        {
            "q": "25",
            "a": 1,
            "correct": "<p>Correct</p>",
            "incorrect": "<p>Incorrect</p>"
        },
        {
            "q": "13",
            "a": 1,
            "correct": "<p>Correct</p>",
            "incorrect": "<p>Incorrect</p>"
        },
        {
            "q": "U",
            "a": 0,
            "correct": "<p>Correct</p>",
            "incorrect": "<p>Incorrect</p>"
        },
        {
            "q": "e",
            "a": 1,
            "correct": "<p>Correct, logs are awesome!</p>",
            "incorrect": "<p>Ha! Gotcha! 'e' stands for the base of natural logarithm. The most important irrational number ever!</p>"
        }
    ]
};

if ($('#categoryQuiz').length) {
	$('#categoryQuiz').categoryQuiz({'autostart': false, 'count': false});
}