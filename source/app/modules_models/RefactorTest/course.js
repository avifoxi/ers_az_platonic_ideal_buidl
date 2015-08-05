/***********************/
// Course Object
// Each module is a Single SCO with internally managed navigation
/***********************/
var course = {};
course.title = 'Dry Run ERS Module';

// where would i get this? 
course.identifier = 'StrokePrevention';
course.lessons = [
  {
    title: 'Introduction',
    time: '1:00',
    slides: [
      {
        title: 'ROCKET AF and ENGAGE AF-TIMI 48 Studies',
        audio: 'ENGA_001'
      }
    ],
    thumbnails: 3
  }, 
  {
    title: 'Overview',
    time: '30:00',
    slides: [
      // ERS
      {
        title: 'The Challenge'
      }, 
      // ERS 6
      {
        title: 'Learning Objectives',
        audio: 'ENGA_003'
      }, 
      {
        title: 'Study Objectives',
        audio: 'ENGA_004'
      }, 
      {
        title: 'ROCKET AF and ENGAGE AF-TIMI 48: Introduction',
        audio: 'ENGA_005'
      }, 
      {
        title: 'Study Overview',
        audio: 'ENGA_032'
      }, 
      {
        title: 'ROCKET AF Study Flow Diagram',
        audio: 'ENGA_007'  
      }, 
      {
        title: 'ENGAGE AF-TIMI 48 Study Design',
        audio: 'ENGA_008'
      }, 
      {
        title: 'Progress Check'
      }, 
      // ERS 16
      {
        title: 'ROCKET AF Study Groups',
        audio: 'ENGA_010'
      }, 
      {
        title: 'ENGAGE AF-TIMI 48 Study Groups',
        audio: 'ENGA_011'
      }, 
      {
        title: 'Study Endpoints',
        audio: 'ENGA_012'
      }, 
      {
        title: 'Primary Efficacy Endpoint',
        audio: 'ENGA_013'
      }, 
      {
        title: 'ENGAGE AF-TIMI 48: Primary Efficacy Endpoint',
        audio: 'ENGA_009'
      }, 
      {
        title: 'ROCKET AF and ENGAGE AF-TIMI 48: Secondary Efficacy Endpoints',
        audio: 'ENGA_014'
      }, 
      {
        title: 'Progress Check'
      },
      // ERS 27 
      {
        title: 'Study Patient Populations',
        audio: 'ENGA_016'
      },
      {
        title: 'ROCKET AF: Patient Population',
        audio: 'ENGA_017'
      },
      {
        title: 'ENGAGE AF-TIMI 48: Patient Population',
        audio: 'ENGA_018'
      },
      // must html encode chads2 for sub char
      {
        title: 'CHADS2 Index for Stroke Risk in Patients with NVAF',
        audio: 'ENGA_019'
      },
      {
        title: 'ROCKET AF Analysis Plan',
        audio: 'ENGA_020_A'
      },
      {
        title: 'ENGAGE AF-TIMI 48 Analysis Plan',
        audio: 'ENGA_020_B'
      }, 
      {
        title: 'Progress Check'
      },
      // ERS 48
      {
        title: 'Bleeding Definitions: ROCKET AF',
        audio: 'ENGA_025'
      },
      {
        title: 'Bleeding Definitions and Net Clinical Outcome Endpoints: ENGAGE AF-TIMI 48',
        audio: 'ENGA_026'
      },
      {
        title: 'Progress Check'
      },
      {
        title: 'Summary',
        audio: 'ENGA_031'
      }
    ],
    thumbnails: 3
  }];

course.assessments = [{
    title: 'Knowledge Check',
    slides: [{
        title: 'Final Assessment'
      }],
    thumbnails: 0
  }];
course.references = {
    title: 'References',
    path: 'references'
};

/***********************/
// User Data 
// Create user object
/***********************/
user = {};

