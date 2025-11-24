# TikTok Scraper

A modular TikTok scraper built with a clean service-model architecture.

## Quick Start

```bash
# Scrape user profile videos
npm run tiktok-scrapping profile-scrapping <username>

# Search videos by hashtag (default region: US)
npm run tiktok-scrapping search-hashtag <hashtag>

# Search videos by hashtag with custom region
npm run tiktok-scrapping -- search-hashtag <hashtag> --region=<region>
```

## Architecture

### Models

- **TikTok** (`src/models/TikTok.js`) - Data model representing a TikTok video with formatted properties

### Services

- **ProfileVideoService** (`src/services/ProfileVideoService.js`) - Scrapes TikTok videos from a user's profile
- **SearchByHashtagService** (`src/services/SearchByHashtagService.js`) - Searches TikTok videos by hashtag
- **FileService** (`src/services/FileService.js`) - Handles file operations (saving/reading JSON)

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the project root:

```
TIKTOK_SCRAPPER_API=your_api_key_here
```

## Usage

### Scrape Videos by Username

```bash
npm run tiktok-scrapping profile-scrapping <username>
```

**Examples:**

```bash
npm run tiktok-scrapping profile-scrapping orangsayacinta
npm run tiktok-scrapping profile-scrapping bellapoarch
npm run tiktok-scrapping profile-scrapping fajrialghani19
```

This will scrape all videos from the specified user's profile and save them to `src/result/profile-videos/<username>-results.json`.

### Search Videos by Hashtag

```bash
npm run tiktok-scrapping -- search-hashtag <hashtag> [--region=<region>]
```

**Examples:**

```bash
# Default region (US)
npm run tiktok-scrapping search-hashtag fyp

# With custom region (note the -- separator before options)
npm run tiktok-scrapping -- search-hashtag fyp --region=ID
npm run tiktok-scrapping -- search-hashtag viral --region=JP
npm run tiktok-scrapping -- search-hashtag prabowo --region=ID
```

**Available Regions:** US, ID, JP, KR, GB, AU, etc. (any valid country code)

This will search videos by hashtag and save them to `src/result/hashtag-videos/<hashtag>-results.json`.

**Note:** When using the `--region` flag with npm, you must include `--` before the command to pass options correctly.

**Note:** Hashtag search is limited to 10 pages by default to avoid excessive API calls. You can modify this in the code if needed.

### Using Services Programmatically

#### Profile Video Scraping

```javascript
import { ProfileVideoService } from "./services/ProfileVideoService.js";
import { FileService } from "./services/FileService.js";

const apiKey = process.env.TIKTOK_SCRAPPER_API;
const service = new ProfileVideoService(apiKey);

// Scrape all videos from a user
const videos = await service.scrapeAllVideos("username");

// Save to file
FileService.saveToJson("username", videos);
```

#### Hashtag Search

```javascript
import { SearchByHashtagService } from "./services/SearchByHashtagService.js";
import { FileService } from "./services/FileService.js";

const apiKey = process.env.TIKTOK_SCRAPPER_API;
const service = new SearchByHashtagService(apiKey);

// Search by hashtag with options
const videos = await service.scrapeAllByHashtag("fyp", {
  region: "US", // Optional: Set proxy region
  trim: true, // Optional: Get trimmed response
  maxPages: 5, // Optional: Limit number of pages
});

// Save to file
FileService.saveToJson("fyp_hashtag", videos);
```

#### Single Page Hashtag Search

```javascript
import { SearchByHashtagService } from "./services/SearchByHashtagService.js";

const service = new SearchByHashtagService(apiKey);

// Get single page with cursor for pagination
const response = await service.searchByHashtag("fyp", {
  region: "US",
  cursor: 10, // Use cursor from previous response
  trim: false,
});

console.log(response.aweme_list); // Array of videos
console.log(response.cursor); // Next cursor for pagination
console.log(response.has_more); // 1 if more results available
```

## API Reference

### ProfileVideoService

**Constructor:**

- `new ProfileVideoService(apiKey)`

**Methods:**

- `fetchVideos(handle, maxCursor)` - Fetch a single page of videos
- `scrapeAllVideos(handle)` - Scrape all videos from a profile

### SearchByHashtagService

**Constructor:**

- `new SearchByHashtagService(apiKey)`

**Methods:**

- `searchByHashtag(hashtag, options)` - Search single page by hashtag
  - `hashtag` (string, required) - Hashtag to search (with or without #)
  - `options.region` (string, optional) - Proxy region (e.g., "US")
  - `options.cursor` (number, optional) - Pagination cursor
  - `options.trim` (boolean, optional) - Return trimmed response
- `scrapeAllByHashtag(hashtag, options)` - Scrape all videos for a hashtag
  - `hashtag` (string, required) - Hashtag to search (with or without #)
  - `options.region` (string, optional) - Proxy region
  - `options.trim` (boolean, optional) - Return trimmed response
  - `options.maxPages` (number, optional) - Maximum pages to fetch

### FileService

**Static Methods:**

- `saveToJson(handle, tiktoks, outputDir)` - Save TikToks to JSON file
- `fileExists(filepath)` - Check if file exists
- `readJson(filepath)` - Read JSON file

## Output Format

Videos are saved as JSON with the following structure:

```json
[
  {
    "aweme_id": "6862153058223197445",
    "desc": "To the 🐝 🐝 🐝  #fyp",
    "url": "https://www.tiktok.com/@bellapoarch/video/6862153058223197445",
    "likes": 68933772,
    "comments": 2901351,
    "shares": 42457977,
    "views": 852942803,
    "create_time": 1597719521,
    "video": "https://...",
    "videoCover": "https://...",
    "videoHeight": 1024,
    "videoWidth": 576
  }
]
```

## Why This Architecture?

**Separation of Concerns**: Each component has a single responsibility

- Models handle data structure
- Services handle business logic
- Main file coordinates them

**Maintainability**: Changes to the API, data format, or file handling can be made in isolated files

**Reusability**: Services and models can be imported and used in other parts of your application

**Testability**: Each service and model can be tested independently

**Scalability**: Easy to add new features like database storage or additional scraping sources
