# Deployment Guide - Get Your URL Shortener Online!

Your URL shortener currently only works on `localhost`. Let's get it online with a **real public URL** that anyone can access!

---

## 🚀 Quick Deployment Options (Ranked by Easiest)

### Option 1: **Render** (RECOMMENDED - Easiest & Free)
⭐ **Best for beginners**
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Easy database setup
- ✅ Gets you a URL like: `https://your-app.onrender.com`

### Option 2: **Railway** (Very Easy & Free Trial)
- ✅ $5 free credit monthly
- ✅ Super simple setup
- ✅ Great for Node.js apps
- ✅ Gets you a URL like: `https://your-app.up.railway.app`

### Option 3: **Vercel** (Good for Node.js)
- ✅ Free tier
- ✅ Fast deployment
- ✅ Great for frontend + serverless
- ✅ Gets you a URL like: `https://your-app.vercel.app`

### Option 4: **Heroku** (Classic Choice)
- ⚠️ No longer free, but has $5/month hobby tier
- ✅ Well-documented
- ✅ Industry standard
- ✅ Gets you a URL like: `https://your-app.herokuapp.com`

---

## 📝 STEP-BY-STEP: Deploy to Render (Easiest!)

### Prerequisites:
1. Create a GitHub account (if you don't have one)
2. Create a Render account at https://render.com (sign up with GitHub)

### Step 1: Prepare Your Code for Deployment

First, we need to make a small change to handle the database in production:

**Update `server.js`:**
```javascript
// Change this line:
const db = new sqlite3.Database('./urls.db', (err) => {

// To this (to use an environment variable for database path):
const DB_PATH = process.env.DATABASE_URL || './urls.db';
const db = new sqlite3.Database(DB_PATH, (err) => {
```

**Create a new file called `render.yaml`** in your project root:
```yaml
services:
  - type: web
    name: url-shortener
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

### Step 2: Push to GitHub

```bash
# In your project folder:
git init
git add .
git commit -m "Initial commit - URL Shortener"

# Create a new repository on GitHub (github.com/new)
# Then run these commands (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/url-shortener.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will auto-detect it's a Node.js app
5. Settings:
   - **Name**: `url-shortener` (or anything you want)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click "Create Web Service"
7. Wait 2-3 minutes for deployment

**Your app will be live at: `https://url-shortener-XXXX.onrender.com`** 🎉

### Step 4: Update Frontend URL

After deployment, update the API URL in `public/index.html`:

```javascript
// Change this:
const API_URL = 'http://localhost:3001';

// To your Render URL:
const API_URL = 'https://url-shortener-XXXX.onrender.com';
// OR make it dynamic:
const API_URL = window.location.origin;
```

Commit and push this change, Render will auto-redeploy!

---

## 📝 STEP-BY-STEP: Deploy to Railway

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your url-shortener repository
4. Railway auto-detects Node.js
5. Click "Deploy"

**Your app will be live at: `https://url-shortener.up.railway.app`** 🎉

### Step 3: Get Your Public URL
1. Go to your project settings
2. Click "Generate Domain"
3. Copy your public URL

---

## 📝 STEP-BY-STEP: Deploy to Vercel (Alternative)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Create `vercel.json`
Create this file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "public/$1"
    }
  ]
}
```

### Step 3: Deploy
```bash
vercel login
vercel
```

Follow the prompts, and you'll get a URL like: `https://url-shortener.vercel.app`

---

## 🔧 Important: Update Your Code for Production

### 1. Make API URL Dynamic

**In `public/index.html`, change:**
```javascript
const API_URL = 'http://localhost:3001';
```

**To:**
```javascript
// This automatically uses the correct URL in both dev and production
const API_URL = window.location.origin;
```

### 2. Handle Database Persistence

⚠️ **IMPORTANT**: Free hosting platforms often use ephemeral storage, meaning your SQLite database might reset!

**Solution: Use a Persistent Database**

For Render, add PostgreSQL:
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Create a free PostgreSQL database
3. Update your code to use PostgreSQL instead of SQLite

**OR** for simplicity, use Render's disk storage:
1. In Render dashboard → Settings → Disk
2. Add a persistent disk at `/data`
3. Update database path: `const DB_PATH = '/data/urls.db';`

---

## 📋 Checklist Before Deploying

- [ ] Code is on GitHub
- [ ] `package.json` has all dependencies
- [ ] Changed API_URL to `window.location.origin`
- [ ] Tested app locally one more time
- [ ] Committed all changes
- [ ] Ready to deploy!

---

## 🎯 After Deployment

### Test Your Live App:
1. Visit your public URL
2. Create a short URL
3. Test the redirect
4. Check analytics work

### Share It:
- Add the live URL to your resume
- Share on LinkedIn
- Include in your portfolio
- Use it in interviews: "Here's the live version..."

---

## 🔒 Production Improvements (Optional)

Once deployed, consider adding:

### 1. Environment Variables
```javascript
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
```

### 2. Database Backup Script
```bash
# Add to package.json scripts:
"backup": "cp urls.db backups/urls-$(date +%Y%m%d).db"
```

### 3. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/shorten', limiter);
```

### 4. Custom Domain (Optional)
Most platforms let you add a custom domain:
- Buy domain from Namecheap/GoDaddy (~$10/year)
- Add to your hosting platform
- Now your URLs are: `https://yourdomain.com/abc123`

---

## 💰 Cost Comparison

| Platform | Free Tier | Cost After Free |
|----------|-----------|-----------------|
| Render | 750 hours/month | $7/month |
| Railway | $5 credit/month | Pay as you go |
| Vercel | Unlimited hobby | $20/month pro |
| Heroku | None | $5/month minimum |

**Recommendation**: Start with Render (free) or Railway ($5 credit covers most usage)

---

## 🐛 Common Deployment Issues

### Issue: "Application Error"
- Check logs in your platform dashboard
- Make sure all dependencies are in package.json
- Verify start command is correct

### Issue: "Database not persisting"
- Add persistent disk storage
- Or switch to hosted PostgreSQL

### Issue: "CORS errors"
- Update CORS settings in server.js
- Make sure frontend uses correct API URL

### Issue: "Port already in use"
- Use `process.env.PORT` for dynamic port assignment
- Platforms like Render/Railway assign ports automatically

---

## 📱 What Your Deployed URLs Will Look Like

**Before (localhost):**
```
http://localhost:3001/abc123
```

**After (deployed on Render):**
```
https://url-shortener-xyz.onrender.com/abc123
```

**With custom domain:**
```
https://short.yourdomain.com/abc123
```

---

## 🎤 Telling Interviewers

When mentioning your project:

❌ Don't say: "It only works on my computer"

✅ Do say: "It's deployed on Render and publicly accessible. Here's the live URL..."

This shows:
- You know how to deploy applications
- You understand production vs development
- You've dealt with real-world hosting considerations

---

## 🚀 Quick Start (TL;DR)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Go to Render.com**
   - Sign up with GitHub
   - New Web Service
   - Connect repository
   - Deploy

3. **Update frontend API URL**
   ```javascript
   const API_URL = window.location.origin;
   ```

4. **Share your live URL!** 🎉

---

Need help with any step? Just ask! 🙋‍♂️
