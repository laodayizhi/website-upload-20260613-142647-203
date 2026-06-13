(function () {
    var video = document.querySelector('[data-player]');
    var playButton = document.querySelector('[data-play-button]');

    if (!video) {
        return;
    }

    var videoUrl = video.getAttribute('data-video') || video.currentSrc || video.src;
    var hlsInstance = null;

    function attachVideo() {
        if (!videoUrl) {
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90
            });
            hlsInstance.loadSource(videoUrl);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal && hlsInstance) {
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hlsInstance.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hlsInstance.recoverMediaError();
                    } else {
                        hlsInstance.destroy();
                        hlsInstance = null;
                        video.src = videoUrl;
                    }
                }
            });
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
            return;
        }

        video.src = videoUrl;
    }

    function playVideo() {
        var result = video.play();
        if (result && typeof result.catch === 'function') {
            result.catch(function () {
                video.controls = true;
            });
        }
    }

    attachVideo();

    if (playButton) {
        playButton.addEventListener('click', function () {
            playButton.classList.add('is-hidden');
            playVideo();
        });
    }

    video.addEventListener('play', function () {
        if (playButton) {
            playButton.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', function () {
        if (playButton && video.currentTime === 0) {
            playButton.classList.remove('is-hidden');
        }
    });
}());
