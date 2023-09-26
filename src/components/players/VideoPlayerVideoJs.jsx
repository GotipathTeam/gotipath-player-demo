import { useEffect, useRef } from 'react';

import { playerFeatures } from '@/lib/config';
import { getPlayerElement, getVideoJsOptions } from '@/lib/player/config';
import { changeImaAdTag, disposeImaAds, setupImaAds } from '@/lib/player/ima';
import { setupVideoPlayer } from '@/lib/player/setup';
import Script from 'next/script';

const playersClasses = 'z-10 video-js vjs-big-play-centered focus:outline-none focus:border-transparent';

export default function VideoPlayerVideoJs({ video, onFinish }) {
    const isSubscribed = false;
    const playerRef = useRef(null);

    useEffect(() => {
        try {
            window.playingVideoId = video.id;
            if (!playerRef.current) {
                let playerEl = getPlayerElement('#gotipathPlayer', playersClasses, video.title);
                playerRef.current = setupVideoPlayer(video, playerEl);
                playerRef.current.on('ended', onFinish);
                window.player = playerRef.current;
            } else {
                const options = getVideoJsOptions({ video });
                playerRef.current.options(options);
                playerRef.current.src(options.sources);
                changeImaAdTag(playerRef.current, video);
            }
        } catch (e) {
            console.error(e);
        }
    }, [video]);

    useEffect(() => {
        return () => {
            if (playerRef.current) {
                playerRef.current.off('ended', onFinish);
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    // Ads setup - only for AVOD content and non subscribed users.
    useEffect(() => {
        if (!playerRef.current) return;
        !isSubscribed ? setupImaAds(playerRef.current, video) : disposeImaAds(playerRef.current);
    }, [video, isSubscribed]);

    return (
        <>
            {!isSubscribed && <Script src="//imasdk.googleapis.com/js/sdkloader/ima3.js" strategy="beforeInteractive" />}
            {playerFeatures.chromecast && <Script src='https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1' strategy="beforeInteractive" />}
            <div id="gotipathPlayer" className="absolute inset-0 w-full h-full rounded-md bg-black/50">
                <video
                    data-vjs-player
                    className={playersClasses}
                    data-matomo-title={video.title}
                    poster={video.thumbnail}
                    preload="auto"
                    controls
                    playsInline
                ></video>
            </div>
        </>
    );
}
