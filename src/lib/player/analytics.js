import { muxEnvKey } from "../config";

export function getMuxPluginConfig(video) {
  return {
    debug: false,
    data: {
      env_key: muxEnvKey,
      // Site Metadata
      sub_property_id: '',
      // Player Metadata
      player_name: 'Web Player',
      player_version: '1.0.0',
      // Video Metadata
      video_id: video.id,
      video_title: video.title,
      video_series: video.series?.title,
      video_duration: video.duration * 1000,
      video_stream_type: video.classname == "App\\Models\\Stream" ? 'live' : 'on-demand',
      video_cdn: 'Gotipath CDN'
    }
  }
}