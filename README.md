# 🚀 SkillSync - Let's Start Solve Secure

**Team Vebrion** | Cosmohack 2025 - Smart Education

A unified ecosystem for skill tracking, learning retention, career navigation, and task management.

## ✨ Features

### 1. 🎯 Skill Extraction (NLP-Powered)
- Extract skills from text using Natural Language Processing
- Build your skill graph with Neo4j
- Track skill relationships and progression

### 2. 🧠 Retention Tracker (SM-2 Algorithm)
- Spaced repetition learning system
- SM-2 algorithm for optimal review scheduling
- Track learning progress and retention rates

### 3. 🚀 Career Navigator
- Career path recommendations based on your skills
- Skill gap analysis
- Salary insights and demand metrics

### 4. ✅ Task Manager
- **Today's tasks** for immediate focus
- **Tomorrow's preview** - see what's coming next
- Priority-based task organization
- Skill-tagged tasks

## 🛠️ Tech Stack

### Backend
- **Node.js** + Express
- **MongoDB** - User data & tasks
- **Neo4j** - Skill graph database
- **Natural** - NLP library for skill extraction
- **JWT** - Authentication

### Frontend
- **React** - UI framework
- **Vanilla JS** - Custom interactions
- **Recharts** - Data visualization
- **React Router** - Navigation

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- Neo4j Desktop or Neo4j Aura

### Backend Setup

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm start
```

## 🗄️ Database Setup

### MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Neo4j
1. Install Neo4j Desktop: https://neo4j.com/download/
2. Create a new database
3. Start the database
4. Update `.env` with connection details

## 🌐 Environment Variables

Create `.env` file in backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillsync
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

## 🚀 Running the Application

1. Start MongoDB
2. Start Neo4j
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `cd frontend && npm start`
5. Open http://localhost:3000

## 👥 Team Vebrion

- Tridibesh Sastri
- Priyanshu Saha
- Suman Mukherjee
- Debjyoti Barik

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Skills
- `POST /api/skills/extract` - Extract skills from text
- `POST /api/skills/add` - Add skill to user profile
- `GET /api/skills/graph/:userId` - Get user skill graph

### Retention
- `POST /api/retention/add` - Add learning item
- `POST /api/retention/review/:id` - Review item (SM-2)
- `GET /api/retention/due/:userId` - Get due items

### Career
- `GET /api/career/paths/:userId` - Get career recommendations

### Tasks
- `POST /api/tasks/create` - Create new task
- `GET /api/tasks/user/:userId` - Get user tasks (today + tomorrow)
- `PATCH /api/tasks/update/:id` - Update task
- `DELETE /api/tasks/delete/:id` - Delete task

## 🎨 Features Breakdown

### Tomorrow's Task Preview
Tasks due tomorrow are automatically shown today, helping users prepare in advance. The system uses intelligent date filtering to separate:
- **Today's tasks**: Due before midnight today
- **Tomorrow's tasks**: Due before midnight tomorrow

### SM-2 Spaced Repetition
The retention tracker implements the SM-2 algorithm for optimal learning:
- Quality ratings (0-5)
- Dynamic ease factor adjustment
- Intelligent interval calculation
- Optimal review scheduling

### NLP Skill Extraction
Uses natural language processing to:
- Extract technical skills from text
- Identify skill patterns
- Match against tech skills dictionary
- Build skill relationships

## 📄 License

MIT License - Team Vebrion

## 🏆 Cosmohack 2025

Built for Cosmohack 2025 - Smart Education Track

**Tagline:** Let's Start Solve Secure
**Vision:** A unified ecosystem to build your own tracker
