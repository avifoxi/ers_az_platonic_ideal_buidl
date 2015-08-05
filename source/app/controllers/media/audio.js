/*
  
  jPlayer helper functions
  
*/ 
var $ = require('jquery');
var Audio = {};


Audio.isPlaying = function (audioPlayer) {
  return !$(audioPlayer).data().jPlayer.status.paused;
};

// Play global player with options: 'playpause', 'restart' or 'wait'
Audio.playAudio = function (audioPlayer, option) {
  if (!$(audioPlayer).length)
    return;
  var paused = !Audio.isPlaying(audioPlayer);
  switch (option) {
    case 'playpause':
      // if playing, pause and vice versa
      if (paused) {
        $(audioPlayer).jPlayer("play");
      } else {
        $(audioPlayer).jPlayer("pause");
      }
      break;
    case 'restart':
      // if playing, restart clip
      $(audioPlayer).jPlayer("play", 0);
      break;
    case 'wait':
      // if playing, do nothing, else play
      if (paused) {
        $(audioPlayer).jPlayer("play");
      } else {
        return;
      }
      break;
    default:
      // default to play pause
      // if playing, pause and vice versa
      if (paused) {
        $(audioPlayer).jPlayer("play");
      } else {
        $(audioPlayer).jPlayer("pause");
      }
      break;
  }
};

Audio.stopAudio = function (audioPlayer) {
  $(audioPlayer).jPlayer("stop");
  if (audioPlayer === '#global_audio') {
    $('.audio_summary.playing').removeClass('playing');
  }
};

Audio.updateAudio = function (audioPlayer, audioFile) {
  $(audioPlayer).jPlayer("setMedia", {
    mp3: audioFile + ".mp3"
  });
};
    



module.exports = Audio;