const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./urls.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS urls (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          short_code TEXT UNIQUE NOT NULL,
          original_url TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          total_clicks INTEGER DEFAULT 0
        )
      `, (err) => {
        if (err) {
          console.error('Error creating urls table:', err);
          reject(err);
        }
      });

      db.run(`
        CREATE TABLE IF NOT EXISTS analytics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          short_code TEXT NOT NULL,
          clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          ip_address TEXT,
          user_agent TEXT,
          referer TEXT,
          country TEXT,
          city TEXT,
          FOREIGN KEY (short_code) REFERENCES urls(short_code)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating analytics table:', err);
          reject(err);
        }
      });

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_short_code ON analytics(short_code)
      `, (err) => {
        if (err) {
          console.error('Error creating index on short_code:', err);
        }
      });

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_clicked_at ON analytics(clicked_at)
      `, (err) => {
        if (err) {
          console.error('Error creating index on clicked_at:', err);
        } else {
          console.log('Database tables initialized successfully');
          resolve();
        }
      });
    });
  });
}

// Helper function to validate URL
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// API Routes

// Create short URL
app.post('/api/shorten', (req, res) => {
  const { url, customCode } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const shortCode = customCode || nanoid(7);

  // Check if custom code already exists
  db.get('SELECT short_code FROM urls WHERE short_code = ?', [shortCode], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (row) {
      return res.status(400).json({ error: 'Short code already exists' });
    }

    // Insert new URL
    db.run(
      'INSERT INTO urls (short_code, original_url) VALUES (?, ?)',
      [shortCode, url],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create short URL' });
        }

        res.json({
          shortCode,
          shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
          originalUrl: url
        });
      }
    );
  });
});

// Get all URLs with analytics
app.get('/api/urls', (req, res) => {
  const query = `
    SELECT 
      u.id,
      u.short_code,
      u.original_url,
      u.created_at,
      u.total_clicks,
      COUNT(a.id) as analytics_count
    FROM urls u
    LEFT JOIN analytics a ON u.short_code = a.short_code
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get analytics for a specific short code
app.get('/api/analytics/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  // Get URL info
  db.get('SELECT * FROM urls WHERE short_code = ?', [shortCode], (err, url) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Get analytics data
    db.all(
      `SELECT 
        clicked_at,
        ip_address,
        user_agent,
        referer,
        country,
        city
      FROM analytics 
      WHERE short_code = ? 
      ORDER BY clicked_at DESC`,
      [shortCode],
      (err, analytics) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        // Get click statistics by date
        db.all(
          `SELECT 
            DATE(clicked_at) as date,
            COUNT(*) as clicks
          FROM analytics 
          WHERE short_code = ?
          GROUP BY DATE(clicked_at)
          ORDER BY date DESC
          LIMIT 30`,
          [shortCode],
          (err, dailyStats) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            res.json({
              url,
              analytics,
              dailyStats
            });
          }
        );
      }
    );
  });
});

// Delete URL
app.delete('/api/urls/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  // Delete analytics first (foreign key)
  db.run('DELETE FROM analytics WHERE short_code = ?', [shortCode], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Delete URL
    db.run('DELETE FROM urls WHERE short_code = ?', [shortCode], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Short URL not found' });
      }

      res.json({ message: 'URL deleted successfully' });
    });
  });
});

// Redirect route - this handles the actual URL redirection
app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  // Get original URL
  db.get('SELECT original_url FROM urls WHERE short_code = ?', [shortCode], (err, row) => {
    if (err) {
      return res.status(500).send('Server error');
    }

    if (!row) {
      return res.status(404).send('Short URL not found');
    }

    // Track analytics
    const analyticsData = {
      short_code: shortCode,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent'),
      referer: req.get('referer') || 'Direct'
    };

    db.run(
      `INSERT INTO analytics (short_code, ip_address, user_agent, referer) 
       VALUES (?, ?, ?, ?)`,
      [analyticsData.short_code, analyticsData.ip_address, analyticsData.user_agent, analyticsData.referer]
    );

    // Increment total clicks
    db.run('UPDATE urls SET total_clicks = total_clicks + 1 WHERE short_code = ?', [shortCode]);

    // Redirect to original URL
    res.redirect(row.original_url);
  });
});

// Start server only after database is initialized
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`URL Shortener running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
