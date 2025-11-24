import axios from "axios";
import { TikTok } from "../models/TikTok.js";

/**
 * Profile Video Service
 * Handles scraping TikTok profile videos by username
 */
export class ProfileVideoService {
  constructor(apiKey) {
    this.apiUrl = "https://api.scrapecreators.com/v3/tiktok/profile/videos";
    this.apiKey = apiKey;
  }

  /**
   * Fetch TikTok videos for a given handle with optional cursor for pagination
   * @param {string} handle - TikTok username
   * @param {string|null} maxCursor - Pagination cursor
   * @returns {Promise<Object>} API response data
   */
  async fetchVideos(handle, maxCursor = null) {
    try {
      let url = `${this.apiUrl}?handle=${handle}`;

      if (maxCursor) {
        url += `&max_cursor=${maxCursor}`;
      }

      const response = await axios.get(url, {
        headers: {
          "x-api-key": this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching TikTok videos:", error.message);
      throw error;
    }
  }

  /**
   * Scrape all videos for a given handle
   * @param {string} handle - TikTok username
   * @returns {Promise<Array<TikTok>>} Array of TikTok instances
   */
  async scrapeAllVideos(handle) {
    const startTime = Date.now();
    console.log(`Starting scrape for @${handle}...`);

    let maxCursor = null;
    let hasMore = true;
    const tiktoks = [];

    while (hasMore) {
      const data = await this.fetchVideos(handle, maxCursor);

      if (data.aweme_list && data.aweme_list.length > 0) {
        console.log(`Fetched ${data.aweme_list.length} videos`);

        const formattedTiktoks = data.aweme_list.map((rawData) =>
          TikTok.fromApiResponse(rawData)
        );

        tiktoks.push(...formattedTiktoks);
        console.log(`Total videos scraped: ${tiktoks.length}`);
      }

      maxCursor = data.max_cursor;
      hasMore = !!maxCursor;
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`Scraping completed in ${duration} seconds`);
    console.log(`Total videos scraped: ${tiktoks.length}`);

    return tiktoks;
  }
}
