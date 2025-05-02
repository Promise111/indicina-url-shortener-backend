# URL Shortener API

A NestJS-based URL shortening service that allows users to create shortened URLs, track click statistics, and manage their links.

## Features

- URL shortening with custom short codes
- Automatic HTTPS enforcement for all links
- Click tracking and statistics
- Search functionality for URLs
- Swagger API documentation

## Tech Stack

- NestJS framework
- TypeORM for database operations
- MySQL database
- Swagger for API documentation

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and other settings.

## Running the Application

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

## API Endpoints

- `POST /api/encode` - Shorten a URL
- `GET /api/decode?shortUrl=...` - Get original URL from short URL
- `GET /api/statistic/:shortCode` - Get statistics for a short URL
- `GET /api/list` - List all URLs
- `GET /api/search?q=...` - Search URLs
- `GET /:shortCode` - Redirect to original URL

## API Documentation

API documentation is available at `/docs` when running in development mode.

## License

[MIT](LICENSE)