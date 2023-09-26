export function resumeVideoWhereLeft() {
    const lastPlayedTime = getLastPlayedTime();
    const currentTime = window.player?.currentTime();
    if (
        lastPlayedTime > 0 &&
        lastPlayedTime > currentTime &&
        Math.abs(lastPlayedTime - currentTime) > 10 &&
        Math.abs(window.player?.duration() - lastPlayedTime) > 5
    ) {
        window.player?.currentTime(lastPlayedTime);
    }
}

export function rememberLastPlayedDuration(forced = false) {
    const lastPlayedTime = getLastPlayedTime();
    const currentTime = window.player?.currentTime();
    if (currentTime > lastPlayedTime || forced) {
        window.localStorage.setItem('vjs_resume-' + window.playingVideoId, currentTime);
    }
}

export function getLastPlayedTime() {
    return parseFloat(window.localStorage.getItem('vjs_resume-' + window.playingVideoId)) || 0;
}

export function setLastPlayedTime(duration) {
    return window.localStorage.getItem('vjs_resume-' + window.playingVideoId, duration);
}
