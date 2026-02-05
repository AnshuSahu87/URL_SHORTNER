# URL Shortener with Analytics

A professional URL shortening service built with Node.js, Express, React, and SQLite. Features real-time analytics tracking, custom short codes, and a beautiful dashboard interface.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Short Codes**: Create branded, memorable short URLs
- **Real-time Analytics**: Track clicks, referrers, user agents, and timestamps
- **Visual Dashboard**: Beautiful React interface with charts and statistics
- **Click Tracking**: Monitor link performance with detailed metrics
- **Daily Statistics**: View click trends over time with interactive charts
- **Delete URLs**: Remove shortened URLs and associated analytics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone or download the project**
   ```bash
   cd url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3001`

## 📁 Project Structure

```
url-shortener/
├── server.js           # Express backend server
├── package.json        # Project dependencies
├── urls.db            # SQLite database (created automatically)
├── public/
│   └── index.html     # React frontend application
└── README.md          # This file
```

## 🎯 How It Works

### Creating Short URLs

1. Enter your long URL in the input field
2. (Optional) Provide a custom short code
3. Click "Shorten URL"
4. Copy and share your shortened link!

### Tracking Analytics

1. Navigate to "Manage URLs" tab
2. Click "View Analytics" on any shortened URL
3. See detailed metrics including:
   - Total clicks
   - Click timeline (chart)
   - Referrer sources
   - User agents
   - Timestamps

### URL Redirection

When someone visits your short URL (e.g., `http://localhost:3001/abc123`):
- They are automatically redirected to the original URL
- The click is tracked in the analytics database
- Metadata is recorded (IP, user agent, referrer, timestamp)

## 🔧 API Endpoints

### POST /api/shorten
Create a new short URL
```json
{
  "url": "https://example.com/very-long-url",
  "customCode": "mycode" // optional
}
```

### GET /api/urls
Get all shortened URLs with analytics

### GET /api/analytics/:shortCode
Get detailed analytics for a specific short URL

### DELETE /api/urls/:shortCode
Delete a shortened URL and its analytics

### GET /:shortCode
Redirect to original URL (tracks analytics)

## 💾 Database Schema

### URLs Table
- `id`: Unique identifier
- `short_code`: The shortened URL code
- `original_url`: The original long URL
- `created_at`: Creation timestamp
- `total_clicks`: Total number of clicks

### Analytics Table
- `id`: Unique identifier
- `short_code`: Reference to URL
- `clicked_at`: Click timestamp
- `ip_address`: Visitor IP
- `user_agent`: Browser/device info
- `referer`: Source of traffic
- `country`: Visitor country (placeholder)
- `city`: Visitor city (placeholder)

## 🎨 Customization

### Change Port
Edit `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change 3001 to your preferred port
```

### Modify Short Code Length
Edit `server.js`:
```javascript
const shortCode = customCode || nanoid(7); // Change 7 to desired length
```

### Update Styling
Edit the `<style>` section in `public/index.html`

## 🔒 Security Considerations

For production use, consider adding:
- Rate limiting to prevent abuse
- User authentication for URL management
- HTTPS/SSL encryption
- Input validation and sanitization
- CORS restrictions
- API key authentication
- Database backups

## 📊 Analytics Features

- **Click Tracking**: Every click is recorded with timestamp
- **Referrer Tracking**: See where your traffic comes from
- **User Agent Tracking**: Understand what devices/browsers users have
- **Daily Statistics**: Visual charts showing click trends
- **Recent Activity**: View the latest clicks in real-time

## 🚀 Deployment

### Deploying to Production

1. **Environment Variables**: Set `PORT` environment variable
2. **Database**: Consider using PostgreSQL or MySQL for production
3. **Process Manager**: Use PM2 to keep the server running
   ```bash
   npm install -g pm2
   pm2 start server.js --name url-shortener
   ```
4. **Reverse Proxy**: Use Nginx or Apache for better performance
5. **Domain**: Point your domain to the server

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

MIT License - feel free to use this project for your portfolio or commercial purposes.

## 🎓 Learning Points

This project demonstrates:
- RESTful API design
- Database operations with SQLite
- React state management
- Express.js routing and middleware
- Real-time data visualization
- Full-stack JavaScript development
- Analytics tracking implementation

## 📞 Support

For questions or issues, please create an issue in the repository or contact the maintainer.

---

**Perfect for your resume!** This project showcases your ability to build full-stack applications with database integration, analytics tracking, and modern UI design.
