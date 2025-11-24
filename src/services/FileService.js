import fs from "graceful-fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * File Service
 * Handles all file system operations
 */
export class FileService {
  /**
   * Ensure directory exists, create if it doesn't
   * @param {string} dirPath - Directory path
   */
  static ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Save TikTok data to JSON file
   * @param {string} handle - TikTok username or hashtag
   * @param {Array<TikTok>} tiktoks - Array of TikTok instances
   * @param {string} outputDir - Output directory (defaults to project root)
   */
  static saveToJson(handle, tiktoks, outputDir = process.cwd()) {
    const filename = `${handle}_tiktoks.json`;
    const filepath = path.join(outputDir, filename);

    const jsonData = tiktoks.map((tiktok) => tiktok.toJSON());

    try {
      this.ensureDirectoryExists(path.dirname(filepath));
      fs.writeFileSync(filepath, JSON.stringify(jsonData, null, 2));
      console.log(`Data saved to: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error("Error saving file:", error.message);
      throw error;
    }
  }

  /**
   * Save profile video results
   * @param {string} username - TikTok username
   * @param {Array<TikTok>} tiktoks - Array of TikTok instances
   * @returns {string} File path where data was saved
   */
  static saveProfileResults(username, tiktoks) {
    const projectRoot = path.join(__dirname, "../..");
    const resultDir = path.join(projectRoot, "src/result/profile-videos");
    const filename = `${username}-results.json`;
    const filepath = path.join(resultDir, filename);

    const jsonData = tiktoks.map((tiktok) => tiktok.toJSON());

    try {
      this.ensureDirectoryExists(resultDir);
      fs.writeFileSync(filepath, JSON.stringify(jsonData, null, 2));
      console.log(`Data saved to: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error("Error saving file:", error.message);
      throw error;
    }
  }

  /**
   * Save hashtag search results
   * @param {string} hashtag - Hashtag (without #)
   * @param {Array<TikTok>} tiktoks - Array of TikTok instances
   * @returns {string} File path where data was saved
   */
  static saveHashtagResults(hashtag, tiktoks) {
    const projectRoot = path.join(__dirname, "../..");
    const resultDir = path.join(projectRoot, "src/result/hashtag-videos");
    const filename = `${hashtag}-results.json`;
    const filepath = path.join(resultDir, filename);

    const jsonData = tiktoks.map((tiktok) => tiktok.toJSON());

    try {
      this.ensureDirectoryExists(resultDir);
      fs.writeFileSync(filepath, JSON.stringify(jsonData, null, 2));
      console.log(`Data saved to: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error("Error saving file:", error.message);
      throw error;
    }
  }

  /**
   * Check if file exists
   * @param {string} filepath - Path to file
   * @returns {boolean}
   */
  static fileExists(filepath) {
    return fs.existsSync(filepath);
  }

  /**
   * Read JSON file
   * @param {string} filepath - Path to JSON file
   * @returns {Object|Array}
   */
  static readJson(filepath) {
    try {
      const content = fs.readFileSync(filepath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Error reading file:", error.message);
      throw error;
    }
  }
}
