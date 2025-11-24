import dotenv from "dotenv";
import { ProfileVideoService } from "./services/ProfileVideoService.js";
import { SearchByHashtagService } from "./services/SearchByHashtagService.js";
import { FileService } from "./services/FileService.js";

dotenv.config();

/**
 * Parse command line arguments including flags
 * @returns {Object} Parsed arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const parsed = {
    command: args[0],
    argument: args[1],
    options: {},
  };

  // Parse options (--key=value format)
  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      parsed.options[key] = value || true;
    }
  }

  return parsed;
}

/**
 * Display usage information
 */
function showUsage() {
  console.log("Usage:");
  console.log("  npm run tiktok-scrapping profile-scrapping <username>");
  console.log(
    "  npm run tiktok-scrapping -- search-hashtag <hashtag> [--region=<region>]"
  );
  console.log("");
  console.log("Options:");
  console.log(
    "  --region=<region>    Set proxy region for hashtag search (e.g., US, ID, JP)"
  );
  console.log("");
  console.log("Examples:");
  console.log("  npm run tiktok-scrapping profile-scrapping orangsayacinta");
  console.log("  npm run tiktok-scrapping search-hashtag fyp");
  console.log("  npm run tiktok-scrapping -- search-hashtag fyp --region=ID");
  console.log("");
  console.log(
    "Note: When using --region with npm, include -- before the command"
  );
  process.exit(1);
}

/**
 * Scrape videos from a user profile
 * @param {string} username - TikTok username to scrape
 * @param {string} apiKey - API key for authentication
 */
async function scrapeProfile(username, apiKey) {
  const scraperService = new ProfileVideoService(apiKey);
  const tiktoks = await scraperService.scrapeAllVideos(username);

  if (tiktoks.length > 0) {
    FileService.saveProfileResults(username, tiktoks);
    console.log(
      `\nSuccessfully scraped ${tiktoks.length} videos from @${username}`
    );
  } else {
    console.log(`No videos found for @${username}`);
  }
}

/**
 * Search videos by hashtag
 * @param {string} hashtag - Hashtag to search (without #)
 * @param {string} apiKey - API key for authentication
 * @param {Object} options - Search options
 */
async function searchHashtag(hashtag, apiKey, options = {}) {
  const region = options.region || "US";
  console.log(`Using region: ${region}`);

  const searchService = new SearchByHashtagService(apiKey);
  const tiktoks = await searchService.scrapeAllByHashtag(hashtag, {
    region: region,
    maxPages: 10, // Limit to 10 pages to avoid excessive API calls
  });

  if (tiktoks.length > 0) {
    FileService.saveHashtagResults(hashtag, tiktoks);
    console.log(
      `\nSuccessfully scraped ${tiktoks.length} videos for #${hashtag} (region: ${region})`
    );
  } else {
    console.log(`No videos found for #${hashtag}`);
  }
}

/**
 * Main function to handle CLI commands
 */
async function main() {
  try {
    const { command, argument, options } = parseArguments();

    // Validate command and argument
    if (!command || !argument) {
      console.error("Error: Missing command or argument");
      showUsage();
    }

    // Validate API key
    const apiKey = process.env.TIKTOK_SCRAPPER_API;
    if (!apiKey) {
      console.error(
        "Error: TIKTOK_SCRAPPER_API environment variable is not set"
      );
      process.exit(1);
    }

    // Route to appropriate function based on command
    switch (command) {
      case "profile-scrapping":
        await scrapeProfile(argument, apiKey);
        break;

      case "search-hashtag":
        await searchHashtag(argument, apiKey, options);
        break;

      default:
        console.error(`Error: Unknown command "${command}"`);
        showUsage();
    }
  } catch (error) {
    console.error("Error during scraping:", error.message);
    process.exit(1);
  }
}

main();
