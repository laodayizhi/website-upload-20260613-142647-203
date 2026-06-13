(function () {
    function init(source) {
        var video = document.getElementById('movieVideo');
        var cover = document.getElementById('playerCover');
        var hls = null;
        var loaded = false;

        if (!video || !source) {
            return;
        }

        function bind() {
            if (loaded) {
                return;
            }
            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            bind();
            if (cover) {
                cover.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', play);
        }

        video.addEventListener('click', function () {
            if (!loaded) {
                play();
            }
        });

        video.addEventListener('play', function () {
            bind();
            if (cover) {
                cover.classList.add('is-hidden');
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.MoviePlayer = {
        init: init
    };
})();
