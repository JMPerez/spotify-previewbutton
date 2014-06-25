(function(Polymer) {
  'use strict';

  var fetchData = function (uri, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.spotify.com/v1/tracks/' + uri.split(':').pop());

    xhr.onload = function (evt) {
      callback(evt.target.status >= 400, JSON.parse(this.response));
    };

    xhr.send();
  };

  Polymer('spotify-previewbutton', {
    uriChanged: function () {
      this.loading = true;

      fetchData(this.uri, function (err, data) {
        this.playing = false;
        this.songTitle = data.name;
        this.author = data.artists[0].name;
        this.cover = data.album.images[1].url;
        this.audio = data.preview_url;
        this.currentTime = 0;
      }.bind(this));
    },

    togglePlay: function () {
      var elem = this.$.audio;
      if (elem.paused) {
        elem.play();
      } else {
        elem.pause();
      }
    },

    onPlayChange: function (e, detail, sender) {
      this.playing = !sender.paused;
    },

    onPlayProgress: function (e, detail, sender) {
      this.currentTime = sender.currentTime;
      this.duration = sender.duration;
    },

    onImageLoaded: function () {
      this.loading = false;
    }
  });

})(window.Polymer);
