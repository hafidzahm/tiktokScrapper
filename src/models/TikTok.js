/**
 * TikTok model class
 * Represents a TikTok video with formatted data
 */
export class TikTok {
  constructor(rawData) {
    this.aweme_id = rawData.aweme_id;
    this.desc = rawData.desc;
    this.url = rawData.share_url?.split("?")[0];
    this.likes = rawData.statistics.digg_count;
    this.comments = rawData.statistics.comment_count;
    this.shares = rawData.statistics.share_count;
    this.views = rawData.statistics.play_count;
    this.create_time = rawData.create_time;
    this.video = rawData?.video?.bit_rate?.[0]?.play_addr?.url_list?.[0];
    this.videoCover = rawData?.video?.cover;
    this.videoHeight = rawData?.video?.height;
    this.videoWidth = rawData?.video?.width;
    this.thumbnail = rawData?.video?.dynamic_cover?.url_list?.[0];
    this.videoWithoutWatermark = rawData?.video?.play_addr?.url_list?.[0];
    this.actualVideo = rawData?.video?.play_addr?.url_list?.[0];
  }

  /**
   * Convert TikTok instance to plain object
   */
  toJSON() {
    return {
      aweme_id: this.aweme_id,
      desc: this.desc,
      url: this.url,
      likes: this.likes,
      comments: this.comments,
      shares: this.shares,
      views: this.views,
      create_time: this.create_time,
      video: this.video,
      videoCover: this.videoCover,
      videoHeight: this.videoHeight,
      videoWidth: this.videoWidth,
      thumbnail: this.thumbnail,
      videoWithoutWatermark: this.videoWithoutWatermark,
      actualVideo: this.actualVideo,
    };
  }

  /**
   * Create TikTok instance from raw API data
   */
  static fromApiResponse(rawData) {
    return new TikTok(rawData);
  }
}
