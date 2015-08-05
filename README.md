Developers work within the source directory, and all changes are streamed through an automated Gulp build process. Developers do not directly touch the 'dist' (distribution) directory.

App -- all javascripts + interactivity
typically will not need to be modified on a per-course basis

Sass -- all styles, written in scss
compiled via grunt
distributed as a single css file

Assets --
  -- global: all shared assets for multiple modules
    - images (logos, shared imgs)
    - fonts
    - audios (silence, etc)
  -- ModuleSpecific
    - images
    - sass overwrites (also translated to css on compile)
    <!-- NOTE ON LESSON CONTENT -->
    <!-- 

      All of the following files, that comprise the module content 
      are written as javascript files, primarily for syntactic sugar, 
      but they contain NO FUNCTIONALITY
      these js files define objects + arrays, and are compiled to JSON 
      in the build process, and combined to ONE courseData.json 
      In lieu of a database, all module data lives here

     -->
    - assessments
    - flashcards
    - lessons
    - course.js