// CSS
import 'videojs-plus/dist/videojs-plus.css';
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
import 'videojs-plus/dist/plugins/live/style.css';

// JS - Must maintain the order
import videojs from 'video.js';
import 'videojs-plus';
import './videojs-plugin-quality-hls';
import 'videojs-plus/dist/plugins/subtitles/index.js';
import 'videojs-plus/dist/plugins/live/index.js';
import 'videojs-mobile-ui';
import 'videojs-contrib-ads';
import 'videojs-ima';
import 'videojs-contrib-quality-levels';
import 'videojs-persist';
import './videojs-plugin-hotkeys';
import "videojs-mux";
import chromecast from '@silvermine/videojs-chromecast/src/js';

if (playerFeatures.chromecast) {
    chromecast(videojs);
}

import { getVideoJsOptions } from './config';
import { rememberLastPlayedDuration, resumeVideoWhereLeft } from './actions';
import { playerFeatures } from '../config';

export function setupVideoPlayer(video, videoEl) {
    const options = getVideoJsOptions({ video });
    // Initialize player
    const player = videojs(videoEl, options, function () {
        onVideoJsPlayerReady({ player, video });
    });
    onVideoPlayerSetup({ player, video });
    return player;
}

export function onVideoPlayerSetup({ player, video }) {
    if (video.is_live) {
        player.live();
    }
    player.mobileUi();
    player.persist();
    if (playerFeatures.chromecast) {
        player.chromecast({
            button: "controlbar",
            metaTitle: video.title,
            metaSubtitle: video.description,
            metaThumnail: video.thumbnail,
        });
    }
}

export function onVideoJsPlayerReady({ player, video }) {
    window.videojs = videojs;
    if (!video.is_live) {
        organizePlayersControls(player);
        enableHotkeys(player);
    }
    // Event Listeners
    player.on('loadedmetadata', function () {
        if (!player.adPlaying && !video.is_live) {
            resumeVideoWhereLeft();
        }
    });
    player.on('timeupdate', function () {
        if (!player.adPlaying && !video.is_live) {
            rememberLastPlayedDuration();
        }
    });
    player.on('seeked', () => {
        if (!player.adPlaying && !video.is_live) {
            rememberLastPlayedDuration(true);
        }
    });
}

function organizePlayersControls(player) {
    // Move buttons to the center
    const root = document.querySelector('.video-js .vjs-control-bar .middle');
    if (!root) {
        return;
    }
    const forwardButton = document.createElement('button');
    const rewindButton = document.createElement('button');
    forwardButton.className = 'z-10 hidden w-10 h-10 bg-white rounded-full forward-control lg:block';
    rewindButton.className = 'z-10 hidden w-10 h-10 bg-white rounded-full rewind-control lg:block';
    root.appendChild(rewindButton);
    root.appendChild(forwardButton);
    forwardButton.onclick = () => player.currentTime(player.currentTime() + 10);
    rewindButton.onclick = () => player.currentTime(player.currentTime() - 10);
}

function enableHotkeys(player) {
    // Enable hotkeys
    player.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false,
        enableVolumeScroll: false,
        enableHoverScroll: true,
        alwaysCaptureHotkeys: false,
    });
}

