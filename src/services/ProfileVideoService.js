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
   * Fetch TikTok videos for a given handle with optional parameters
   * @param {string} handle - TikTok username
   * @param {Object} options - Fetch options
   * @param {string|null} options.maxCursor - Pagination cursor
   * @param {string} options.sortBy - Sort order: 'latest' or 'popular' (default: 'latest')
   * @param {boolean} options.trim - Get trimmed response (default: false)
   * @returns {Promise<Object>} API response data
   */
  async fetchVideos(handle, options = {}) {
    try {
      const params = new URLSearchParams({
        handle: handle,
      });

      if (options.maxCursor) {
        params.append("max_cursor", options.maxCursor);
      }

      if (options.sortBy) {
        params.append("sort_by", options.sortBy);
      }

      if (options.trim !== undefined) {
        params.append("trim", options.trim.toString());
      }

      const url = `${this.apiUrl}?${params.toString()}`;

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
   * @param {Object} options - Scraping options
   * @param {string} options.sortBy - Sort order: 'latest' or 'popular' (default: 'latest')
   * @param {boolean} options.trim - Get trimmed response (default: false)
   * @returns {Promise<Array<TikTok>>} Array of TikTok instances
   */
  async scrapeAllVideos(handle, options = {}) {
    const startTime = Date.now();
    const sortBy = options.sortBy || "latest";
    console.log(`Starting scrape for @${handle}... (sort: ${sortBy})`);

    let maxCursor = null;
    let hasMore = true;
    const tiktoks = [];

    while (hasMore) {
      const data = await this.fetchVideos(handle, {
        maxCursor: maxCursor,
        sortBy: sortBy,
        trim: options.trim,
      });

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
