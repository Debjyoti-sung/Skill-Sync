# 🔧 SkillSync Setup Guide

## Step-by-Step Installation

### 1. Install Prerequisites

#### Node.js
```bash
# Download from https://nodejs.org/
# Verify installation
node --version
npm --version
```

#### MongoDB
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
```

#### Neo4j
```bash
# Download Neo4j Desktop from https://neo4j.com/download/

# Or use Docker
docker run -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j
```

### 2. Clone/Extract Project

```bash
# If using git
git clone <repository-url>
cd skillsync

# Or extract the zip file
unzip skillsync.zip
cd skillsync
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use any text editor

# Start server
npm run dev
```

Expected output:
```
🚀 SkillSync server running on port 5000
📦 MongoDB Connected
```

### 4. Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

### 5. Verify Installation

1. Open http://localhost:3000
2. Register a new account
3. Try each feature:
   - Extract skills from text
   - Add a task for tomorrow
   - Add learning items
   - View career recommendations

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# macOS/Linux
ps aux | grep mongod

# Windows
tasklist | findstr mongod

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb  # Linux
```

### Neo4j Connection Error
```bash
# Verify Neo4j is running
# Check http://localhost:7474

# Update .env with correct credentials
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

### Port Already in Use
```bash
# Backend (Port 5000)
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or change PORT in .env
PORT=5001

# Frontend (Port 3000)
# Change port when prompted or edit package.json
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Production Deployment

### Backend (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create skillsync-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set NEO4J_URI=your_neo4j_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
# REACT_APP_API_URL=your_backend_url
```

### Database Hosting

#### MongoDB Atlas (Free Tier)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in .env

#### Neo4j Aura (Free Tier)
1. Sign up at https://neo4j.com/cloud/aura/
2. Create free instance
3. Get connection details
4. Update Neo4j config in .env

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for your domain in production
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Hash passwords (already implemented with bcrypt)

## 📊 Optional: Sample Data

```bash
# Coming soon: Seed script for demo data
npm run seed
```

## 💡 Tips

1. **Use nodemon**: Backend auto-restarts on changes
2. **Check logs**: Console shows all errors
3. **Neo4j Browser**: Visit http://localhost:7474 to visualize skill graph
4. **MongoDB Compass**: GUI for viewing database
5. **React DevTools**: Browser extension for debugging

## 📞 Support

Having issues? Check:
1. All services are running (MongoDB, Neo4j, Backend, Frontend)
2. .env file is configured correctly
3. Ports are not blocked by firewall
4. Node version is 16 or higher

Team Vebrion - Cosmohack 2025
