window.ERS = ERS || {};

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
	
		in 'contents' is Array of each Tool's pages(or single page) 
		
	*/

	var LANDING_PAGE_STUDY_TOOLS = [
		{
			title: 'Lesson 1',
			ensureUserHasCompleted: null,
			image: 'image.jpg',
			thumbnailInSlider: 'gee i am a jpeg path',
			userHasCompleted: false,
			contents: [
				'path_to_page0.html OR .js ?',
				'path_to_page1.html'
			]
		},
		{
			title: 'Lesson 2',
			ensureUserHasCompleted: ['lesson1'],
			userHasCompleted: false,
			contents: [

			]
		},
		{
			title: 'References',
			ensureUserHasCompleted: null,
			contents: [
				'<path to single ref page>'
			]
		},
		{
			title: 'Flashcards'
			ensureUserHasCompleted: ['lesson1', 'lesson2'],
			contents: [
				{
					heading: 'HEADING TEXT',
					frontText: 'FRONT TEXT',
					frontImage: 'path or null',
					backText: 'BACK TEXT',
					backImage: 'BACK IMAGE!' 
				}
			]
		},
		{
			title: 'Assessments'
			ensureUserHasCompleted: ['lesson1', 'lesson2'],
		}
	]

	return LANDING_PAGE_STUDY_TOOLS;
}

ERS.ModuleName = ModuleName();


// 
// module.exports = ModuleName;