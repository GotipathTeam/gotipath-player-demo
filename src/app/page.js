'use client';

import VideoPlayerVideoJs from '@/components/players/VideoPlayerVideoJs';
import { useState } from 'react';

export default function Home() {
  const [video, setVideo] = useState(videos[0])
  const [index, setIndex] = useState(0)

  function nextVideo() {
    if (index === videos.length - 1) {
      playNthVideo(0)
    } else {
      playNthVideo(index + 1)
    }
  }

  function playNthVideo(n) {
    setIndex(n)
    setVideo(videos[n])
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 space-y-4 text-white bg-gray-900 lg:p-24">
      <div className='relative w-full max-w-md overflow-hidden rounded-md aspect-video'>
        <VideoPlayerVideoJs video={video} onFinish={nextVideo} />
      </div>
      <h1>{video.title}</h1>
      <div className='flex flex-wrap gap-4'>
        {videos.map((video, i) => (
          <div key={video.id} className='relative w-32 aspect-video'>
            <button className={'w-full h-full overflow-hidden rounded-md bloock' + ' ' + (i == index ? 'ring ring-white' : '')} onClick={() => playNthVideo(i)}>
              <img src={video.poster} className='object-cover w-full h-full' />
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

const videos = [
  {
    id: "1",
    title: "Large Big Buck Bunny",
    src: "https://mdtp-a.akamaihd.net/customers/akamai/video/VfE.mp4",
    poster: "https://upload.wikimedia.org/wikipedia/commons/7/70/Big.Buck.Bunny.-.Opening.Screen.png"
  },
  {
    id: "xysdassds",
    title: "HLS Sample Video",
    src: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    ad_tag_url: "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
    poster: "https://bitdash-a.akamaihd.net/content/sintel/poster.png",
    is_free: true,
  },
  {
    id: "2",
    title: "Small Big Buck Bunny",
    src: "https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/sample-mp4-file.mp4",
    poster: "https://upload.wikimedia.org/wikipedia/commons/7/70/Big.Buck.Bunny.-.Opening.Screen.png",
  },
  {
    id: "3",
    title: "Sprite Fight",
    src: "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4",
    poster: "https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=980",
  },
  {
    id: "4",
    title: "Not a Buck Bunny from Vidstack",
    src: "https://media-files.vidstack.io/720p.mp4",
    poster: "https://media-files.vidstack.io/poster.png",
  },
  {
    id: "5",
    title: "Elephant's Dream",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://ddz4ak4pa3d19.cloudfront.net/cache/63/3c/633c035e7420fc0c707e1a8ac579b183.jpg"
  },
  {
    id: "6",
    title: "For Bigger Blazes",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://i2-prod.chroniclelive.co.uk/incoming/article15238540.ece/ALTERNATES/s615/0_blazeJPG.jpg",
  },
  {
    id: "7",
    title: "For Bigger Escape",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://assets.tvokids.com/prod/s3fs-public/custom_brand_hero_images/tileSM_bigEscape1.jpg",
  },
];
