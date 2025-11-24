import axios from "axios";
import { TikTok } from "../models/TikTok.js";

/**
 * Search By Hashtag Service
 * Handles searching TikTok videos by hashtag
 */
export class SearchByHashtagService {
  constructor(apiKey) {
    this.baseUrl = "https://api.scrapecreators.com/v1/tiktok/search/hashtag";
    this.apiKey = apiKey;
  }

  /**
   * Search TikTok videos by hashtag with optional parameters
   * @param {string} hashtag - Hashtag to search for (without #)
   * @param {Object} options - Search options
   * @param {string} options.region - Region the proxy will be set to (e.g., "US")
   * @param {number} options.cursor - Cursor to get more videos from previous response
   * @param {boolean} options.trim - Set to true to get a trimmed response
   * @returns {Promise<Object>} API response data
   */
  async searchByHashtag(hashtag, options = {}) {
    try {
      // Remove # from hashtag if present
      const cleanHashtag = hashtag.startsWith("#") ? hashtag.slice(1) : hashtag;

      // Build query parameters
      const params = new URLSearchParams({
        hashtag: cleanHashtag,
      });

      if (options.region) {
        params.append("region", options.region);
      }

      if (options.cursor !== undefined && options.cursor !== null) {
        params.append("cursor", options.cursor.toString());
      }

      if (options.trim !== undefined) {
        params.append("trim", options.trim.toString());
      }

      const url = `${this.baseUrl}?${params.toString()}`;

      const response = await axios.get(url, {
        headers: {
          "x-api-key": this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error searching TikTok by hashtag:", error.message);
      throw error;
    }
  }

  /**
   * Scrape all videos for a given hashtag with pagination
   * @param {string} hashtag - Hashtag to search for (without #)
   * @param {Object} options - Search options
   * @param {string} options.region - Region the proxy will be set to (e.g., "US")
   * @param {boolean} options.trim - Set to true to get a trimmed response
   * @param {number} options.maxPages - Maximum number of pages to fetch (default: unlimited)
   * @returns {Promise<Array<TikTok>>} Array of TikTok instances
   */
  async scrapeAllByHashtag(hashtag, options = {}) {
    const startTime = Date.now();
    const cleanHashtag = hashtag.startsWith("#") ? hashtag.slice(1) : hashtag;
    console.log(`Starting hashtag search for #${cleanHashtag}...`);

    let cursor = null;
    let hasMore = true;
    const tiktoks = [];
    let pageCount = 0;
    const maxPages = options.maxPages || Infinity;

    while (hasMore && pageCount < maxPages) {
      const searchOptions = {
        region: options.region,
        trim: options.trim,
        cursor: cursor,
      };

      const data = await this.searchByHashtag(cleanHashtag, searchOptions);

      if (data.aweme_list && data.aweme_list.length > 0) {
        console.log(
          `Fetched ${data.aweme_list.length} videos (page ${pageCount + 1})`
        );

        const formattedTiktoks = data.aweme_list.map((rawData) =>
          TikTok.fromApiResponse(rawData)
        );

        tiktoks.push(...formattedTiktoks);
        console.log(`Total videos scraped: ${tiktoks.length}`);
      }

      cursor = data.cursor;
      hasMore = data.has_more === 1 && !!cursor;
      pageCount++;
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`Hashtag search completed in ${duration} seconds`);
    console.log(`Total videos scraped: ${tiktoks.length}`);

    return tiktoks;
  }
}
