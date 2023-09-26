import mime from 'mime';
import { muxEnvKey, playerFeatures } from '../config';
import { getMuxPluginConfig } from './analytics';

export function getPlayerElement(parentSelector = '#gotipathPlayer', playersClasses = '', videoTitle = '') {
    let playerEl = document.querySelector(parentSelector + ' video');
    if (!playerEl) {
        // Create video element
        playerEl = document.createElement('video');
        playerEl.setAttribute('data-vjs-player', '');
        if (videoTitle) {
            playerEl.setAttribute('data-matomo-title', videoTitle);
        }
        playerEl.setAttribute('preload', 'auto');
        playerEl.setAttribute('controls', '');
        playerEl.setAttribute('playsInline', '');
        playerEl.setAttribute('class', playersClasses);
        document.querySelector(parentSelector).appendChild(playerEl);
    }
    return playerEl;
}

export function getVideoJsOptions({ video }) {
    const videoUrl = video.src;
    const subtitles = formatSubtitles(video.subtitles);

    return {
        title: video.title,
        autoplay: true,
        playsinline: true,
        sources: [
            {
                src: videoUrl,
                type: getVideoType(videoUrl),
            },
        ],
        tracks: subtitles,
        subtitles: subtitles,
        youtube: { iv_load_policy: 1 },
        responsive: true,
        fill: true,
        poster: video.thumbnail,
        fullscreen: {
            enterOnRotate: true,
            exitOnRotate: true,
            lockOnRotate: true,
            lockToLandscapeOnEnter: false,
            iOS: false,
            disabled: false,
        },
        touchControls: {
            seekSeconds: 10,
            tapTimeout: 300,
            disableOnEnd: false,
            disabled: false,
        },
        techOrder: getTechOrderConfig(),
        chromecast: getChromecastConfig(video),
        language: 'en',
        html5: {
            vhs: {
                overrideNative: true
            },
            nativeAudioTracks: false,
            nativeVideoTracks: false
        },
        plugins: getPluginsConfig(video),
        maxQuality: getMaxQuality(),
    };
}

function formatSubtitles(subtitles) {
    if (!subtitles || subtitles.length === 0) {
        return [];
    }
    return subtitles.map((subtitle) => ({
        src: subtitle.url,
        kind: 'subtitles',
        srclang: subtitle.language,
        label: subtitle.label,
    }));
}

function getMaxQuality() {
    if (playerFeatures.maxQuality > 0) {
        return playerFeatures.maxQuality;
    }
    return 0;
}

export function getVideoType(url) {
    if (!url) {
        return null;
    }
    return mime.getType(url.split('.').pop());
}

function getPluginsConfig(video) {
    const config = {};
    if (muxEnvKey) {
        config.mux = getMuxPluginConfig(video);
    }
    if (playerFeatures.chromecast) {
        config.chromecast = {};
    }
    return config;
}

function getChromecastConfig(video) {
    return {
        requestTitleFn: function (source) {
            return video.title;
        },
        requestSubtitleFn: function (source) {
            if (!video.description) {
                return '';
            }
            return video.description.length > 200 ? (video.description.substring(0, 200) + '....') : video.description;
        },
        requestCustomDataFn: function (source) {
            return video.type;
        },
        modifyLoadRequestFn: function (loadRequest) {
            loadRequest.media.hlsSegmentFormat = 'TS';
            loadRequest.media.hlsVideoSegmentFormat = 'MPEG2_TS';
            return loadRequest;
        }
    }
}

function getTechOrderConfig() {
    if (playerFeatures.chromecast) {
        return ['chromecast', 'html5'];
    }
    return ['html5']
}
