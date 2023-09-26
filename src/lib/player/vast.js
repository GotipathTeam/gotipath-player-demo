import { getLastPlayedTime, setLastPlayedTime } from "./actions";

export function setupVastAds(player, video) {
    // Setup VAST Ads
    let vastConfig = getVastConfig(video);
    if (vastConfig) {
        loadVastScriptAndPlayVast(player, video, vastConfig);
        player.on('ended', () => {
            setLastPlayedTime(0);
            player.vastAds(getVastConfig(video));
            player.resetVast();
        })
        // Reset Vast on Seek
        player.on('seeked', () => {
            // Reset vast ads starting from current time,
            // in order to not play all the previous ads.
            const newVastConfig = getVastConfig(video);
            if (vastConfig.length !== newVastConfig.length) {
                console.log('SEEKED');
                vastConfig = newVastConfig;
                resetVast(player, newVastConfig);
            }
        })
    }
}

export function loadVastScriptAndPlayVast(player, video, vastConfig) {
    if (vastConfig && vastConfig.length > 0) {
        // Load Vast Script
        const script = document.createElement('script');
        script.src = '/videojs/vast.vpaid.min.js';
        document.body.appendChild(script);
        script.onload = () => {
            console.log('Vast script loaded.');
            console.log(vastConfig);
            if (typeof player.vastAds !== typeof undefined && player.vastAds) {
                player.vastAds(vastConfig);
            } else if (typeof player.playVast !== typeof undefined && player.playVast) {
                player.playVast(vastConfig);
            }
            addAdMarkers(vastConfig.map(item => item.timeOffset), player.duration() || video.duration);
        };
    }
}

export function resetVast(player, vastConfig) {
    addAdMarkers(vastConfig.map(item => item.timeOffset), player.duration());
    console.log('RE-SETTING VAST CONFIG:', vastConfig);
    player.adList = [];
    player.adList = vastConfig;
    player.ads.reset();
}

export function getVastConfig(video, timeOffset = 0) {
    if (!video.ad_campaign) {
        return null;
    }

    const vastConfig = [];
    const lastPlayedTime = getLastPlayedTime() + timeOffset;

    // Preroll
    if (video.ad_campaign.preroll && lastPlayedTime <= 5) {
        vastConfig.push({
            tagURL: video.ad_campaign.preroll,
            timeOffset: 0,
            id: 'x01',
            playAlways: true,
        });
    }

    // Midroll
    if (video.ad_campaign.midroll && video.duration) {
        const offset = (video.ad_campaign.offset || 600);
        let i = lastPlayedTime > offset ? (Math.ceil(lastPlayedTime / offset) * offset) : offset;
        for (i; i < (video.duration || 3600); i += offset) {
            vastConfig.push({
                tagURL: video.ad_campaign.midroll,
                timeOffset: i,
                id: 'x0' + i,
                playAlways: false,
            });
        }
    }

    // Postroll
    if (video.ad_campaign.postroll) {
        vastConfig.push({
            tagURL: video.ad_campaign.postroll,
            timeOffset: video.duration || 'end',
            id: 'x03',
            playAlways: true,
        });
    }
    return vastConfig;
}

export function addAdMarkers(cuePoints, duration) {
    const progressBar = document.querySelector(".vjs-progress-control .vjs-slider");
    if (!progressBar) {
        return;
    }
    progressBar.querySelectorAll(".vjs-ad-cue-point").forEach(cue => {
        cue.remove();
    });
    for (let i = 0; i < cuePoints.length; i++) {
        var elem = document.createElement("div");
        elem.className = "vjs-ad-cue-point";
        if (cuePoints[i] === 0) {
            elem.style.left = "0%";
        } else if (cuePoints[i] === -1) {
            elem.style.right = "0%";
        } else if (cuePoints[i] < duration) {
            elem.style.left = ((cuePoints[i] / duration * 100) || 0) + "%";
        } else {
            continue;
        }
        progressBar.appendChild(elem);
    }
}

export function removeAdMarkers() {
    const progressBar = document.querySelector(".vjs-progress-control .vjs-slider");
    if (!progressBar) {
        return;
    }
    progressBar.querySelectorAll(".vjs-ad-cue-point").forEach(cue => {
        cue.remove();
    });
}
