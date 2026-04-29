# 📌 FocusFlow - Academic Operating System

FocusFlow is a high-performance, futuristic academic management system designed to streamline the educational ecosystem for both students and instructors. Built with a "Safe-First" architecture and premium glassmorphism design, it provides real-time tracking of academic objectives, cohort management, and performance analytics.

---

## 🚀 Core Features

### 👨‍🎓 For Students
- **Command Center (Dashboard)**: Real-time telemetry of upcoming classes, pending assignments, and academic status.
- **Task Engine**: Sophisticated task management with filtering by status and deadline proximity.
- **Identity System (Profile)**: Advanced XP and Level system with dynamic badge unlocking based on academic milestones.
- **Performance Nexus**: Chart-free, high-stability analytics dashboard tracking weekly throughput and productivity scores.
- **Knowledge Vault**: Centralized repository for viewing and submitting assignments.

### 👨‍🏫 For Teachers
- **Cohort Deployment**: Initialize and manage educational batches/cohorts with unit enrollment capabilities.
- **Assignment Architect**: Deploy new assignments to specific batches with deadline management.
- **Academic Analytics**: Global view of student participation and batch performance.

---

## 🛠 Tech Stack

- **Frontend**: React.js 18 (Vite)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Atlas)
- **State Management**: React Context API (Protected & Safe-First Hydration)
- **Styling**: Vanilla CSS (Custom Glassmorphism Design System)
- **Icons**: Lucide React
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

---

## 📂 Project Structure

```text
focusflow/
├── frontend/             # React + Vite application (UI/UX Layer)
├── backend/              # Node.js + Express API (Logic Layer)
├── focusflow_doc/        # Comprehensive architectural documentation
├── project_structure/    # Technical mapping of the system
├── README.md             # Project initialization guide
└── .gitignore            # Environment & dependency exclusion rules
```

---

## ⚙️ Installation & Running

### 1. Repository Initialization
```bash
git clone https://github.com/Arunkumar2010/focusflow.git
cd focusflow
```

### 2. Backend Synchronization
1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Configure Environment: Create a `.env` file with `MONGO_URI` and `JWT_SECRET`.
4. Launch API: `npm run dev`

### 3. Frontend Deployment
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Launch UI: `npm run dev`

---

## 🛡️ Stability & Security
FocusFlow utilizes a **Global Error Boundary** system and **Defensive Data Parsing** to ensure 100% uptime, even when handling corrupted local storage or network fluctuations.

---

## 📧 Contact & Support
**Project Lead**: Arunkumar  
**Repository**: [github.com/Arunkumar2010/focusflow](https://github.com/Arunkumar2010/focusflow)
