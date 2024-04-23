var Player = function(playlist) {
  this.playlist = playlist;
  this.index = 0;

  track.innerHTML = '1. ' + playlist[0].title;

  playlist.forEach(function(song) {
    var div = document.createElement('div');
    div.className = 'list-song';
    div.innerHTML = song.title;
    div.onclick = function() {
      player.skipTo(playlist.indexOf(song));
    };
    list.appendChild(div);
  });
};

Player.prototype.play = function(index) {
  var self = this;
  var sound;

  index = typeof index === 'number' ? index : self.index;
  var data = self.playlist[index];

  if (data.howl) {
    sound = data.howl;
  } else {
    sound = data.howl = new Howl({
      src: ['audio/' + data.file + '.mp3'],
      html5: true, 
      onplay: function() {
        duration.innerHTML = self.formatTime(Math.round(sound.duration()));
        requestAnimationFrame(self.step.bind(self));
      }
    });
  }

  sound.play();
  track.innerHTML = (index + 1) + '. ' + data.title;

  if (sound.state() === 'loaded') {
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
  } else {
    loading.style.display = 'block';
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'none';
  }

  self.index = index;
};

Player.prototype.pause = function() {
  var self = this;
  var sound = self.playlist[self.index].howl;
  sound.pause();
  playBtn.style.display = 'block';
  pauseBtn.style.display = 'none';
};

Player.prototype.skip = function(direction) {
  var self = this;
  var index = 0;
  if (direction === 'prev') {
    index = self.index - 1;
    if (index < 0) {
      index = self.playlist.length - 1;
    }
  } else {
    index = self.index + 1;
    if (index >= self.playlist.length) {
      index = 0;
    }
  }
  self.skipTo(index);
};

Player.prototype.skipTo = function(index) {
  var self = this;
  if (self.playlist[self.index].howl) {
    self.playlist[self.index].howl.stop();
  }
  progress.style.width = '0%';
  self.play(index);
};

Player.prototype.step = function() {
  var self = this;
  var sound = self.playlist[self.index].howl;
  var seek = sound.seek() || 0;
  timer.innerHTML = self.formatTime(Math.round(seek));
  progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';
  if (sound.playing()) {
    requestAnimationFrame(self.step.bind(self));
  }
};

Player.prototype.formatTime = function(secs) {
  var minutes = Math.floor(secs / 60) || 0;
  var seconds = (secs - minutes * 60) || 0;
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

var playBtn = document.getElementById('playBtn');
var pauseBtn = document.getElementById('pauseBtn');
var prevBtn = document.getElementById('prevBtn');
var nextBtn = document.getElementById('nextBtn');

var player = new Player([
  {
    title: 'Rave Digger',
    file: 'rave_digger',
    howl: null
  },
  {
    title: '80s Vibe',
    file: '80s_vibe',
    howl: null
  },
  {
    title: 'Running Out',
    file: 'running_out',
    howl: null
  }
]);

playBtn.addEventListener('click', function() {
  player.play();
});
pauseBtn.addEventListener('click', function() {
  player.pause();
});
prevBtn.addEventListener('click', function() {
  player.skip('prev');
});
nextBtn.addEventListener('click', function() {
  player.skip('next');
});

