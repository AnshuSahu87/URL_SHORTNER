# Quick Start Guide

## Get Up and Running in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- Express (web framework)
- SQLite3 (database)
- CORS (cross-origin support)
- Nanoid (short code generation)

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
Connected to SQLite database
URL Shortener running on http://localhost:3001
```

### Step 3: Open Your Browser
Go to: **http://localhost:3001**

## First Time Usage

1. **Create a Short URL**
   - Paste any long URL
   - Click "Shorten URL"
   - Copy your new short link!

2. **Test the Redirect**
   - Click on your short URL
   - You'll be redirected to the original URL
   - The click is tracked automatically

3. **View Analytics**
   - Go to "Manage URLs" tab
   - Click "View Analytics"
   - See your click data and charts!

## Common Commands

```bash
# Start server (production)
npm start

# Start with auto-reload (development)
npm run dev

# Install a new dependency
npm install <package-name>
```

## Troubleshooting

**Port already in use?**
- Edit `server.js` and change the PORT number
- Or kill the process using port 3001

**Database errors?**
- Delete `urls.db` file and restart the server
- The database will be recreated automatically

**React not loading?**
- Make sure the `public` folder exists
- Check that `index.html` is in the `public` folder

## What to Show in Interviews

When discussing this project:

✅ "I built a full-stack URL shortener with Express and React"
✅ "Implemented analytics tracking with SQLite database"
✅ "Used nanoid for unique short code generation"
✅ "Created RESTful API with CRUD operations"
✅ "Built interactive charts for data visualization"
✅ "Tracked user behavior including clicks, referrers, and timestamps"

## Next Steps

- Deploy to Heroku, Vercel, or Railway
- Add user authentication
- Implement rate limiting
- Add QR code generation
- Create link expiration feature
- Add custom domains support

Enjoy your URL Shortener! 🚀
