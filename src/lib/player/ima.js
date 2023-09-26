import { addAdMarkers, removeAdMarkers } from "./vast";

export function setupImaAds(player, video) {
    // Setup IMA Ads
    if (
        video.ad_tag_url &&
        typeof google !== 'undefined' &&
        typeof player.ima === 'function'
    ) {
        player.ima({
            adTagUrl: video.ad_tag_url,
        });
        player.on('ads-manager', function (response) {
            const cuePoints = response?.adsManager?.getCuePoints() || [];
            addAdMarkers(cuePoints, player.duration());
        })
    }
}

export function changeImaAdTag(player, video) {
    if (
        typeof google !== 'undefined' &&
        typeof player.ima === 'object'
    ) {
        removeAdMarkers();
        player.ima.changeAdTag(video.ad_campaign?.url ? video.ad_tag_url : null);
        player.on('ads-manager', function (response) {
            const cuePoints = response?.adsManager?.getCuePoints() || [];
            addAdMarkers(cuePoints, player.duration());
        })
    }
}

export function disposeImaAds(player) {
    if (typeof google !== 'undefined' && typeof player.ima === 'object') {
        player.ima.changeAdTag(null);
        removeAdMarkers();
    }
}