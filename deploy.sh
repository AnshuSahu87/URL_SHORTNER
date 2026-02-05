#!/bin/bash

# Quick Deployment Script
# This script helps you push your code to GitHub quickly

echo "🚀 URL Shortener - Quick Deploy Script"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📝 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Add all files
echo ""
echo "📦 Adding files to git..."
git add .

# Commit
echo ""
echo "💾 Creating commit..."
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update URL Shortener"
fi
git commit -m "$commit_msg"

# Ask for GitHub repository
echo ""
echo "🔗 GitHub Repository Setup"
echo "First, create a new repository on GitHub: https://github.com/new"
echo ""
read -p "Enter your GitHub username: " github_user
read -p "Enter repository name (e.g., url-shortener): " repo_name

# Add remote
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$github_user/$repo_name.git"

# Set main branch
git branch -M main

# Push to GitHub
echo ""
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://render.com and sign up"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository: $github_user/$repo_name"
echo "4. Render will auto-deploy your app!"
echo ""
echo "Your app will be live at: https://$repo_name.onrender.com"
echo ""
echo "🎉 Happy deploying!"
