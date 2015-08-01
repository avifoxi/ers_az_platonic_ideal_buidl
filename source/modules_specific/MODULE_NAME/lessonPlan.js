window.ERS = ERS || {};

// var ModuleName = {};

function ModuleName() {
	/*
	
		MY_ASSET_PATHS 
		JS Object 
		Contains paths of asset dependencies, and is referenced in LANDING_PAGE_STUDY_TOOLS
		
		enclosed in function scope
	*/

	var MY_ASSET_PATHS = {
		audio: '<directory name of audios _relative_to_DIST.index.html>',
		css_overwrites: '< full file path  >',
		images: '< directory name >',
		videos: '< directory name >'
	}

	/*
	
		LANDING_PAGE_STUDY_TOOLS 
		Array -- an ordered list of order of presentation on the home page 
	
		in contents is Array of each Tool's pages
		
	*/

	var LANDING_PAGE_STUDY_TOOLS = [
		lesson1: {
			ensureUserHasCompleted: null,
			title: 'Lesson 1',
			image: 'image.jpg',
			thumbnailInSlider: 
			contents: [
				'path_to_page0.html',
				'path_to_page1.html'
			]
		},
		lesson2: {
			ensureUserHasCompleted: 'lesson1',
			title: 'Lesson 2',
			contents: [

			]
		},
		references: {
			ensureUserHasCompleted: null,
			title: 'References',
			contents: [
				'<path to single ref page>'
			]
		},
		flashcards: {
			ensureUserHasCompleted: ['lesson1', 'lesson2'],
			title: 'Flashcards'
		},
		assessments: {
			ensureUserHasCompleted: ['lesson1', 'lesson2'],
			title: 'Assessments'
		}
	]

	return LANDING_PAGE_STUDY_TOOLS;
}

ERS.ModuleName = ModuleName();


// 
// module.exports = ModuleName;