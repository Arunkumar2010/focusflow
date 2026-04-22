# Project Documentation: FocusFlow
## Hybrid Productivity & Academic Management Platform

**Date:** April 21, 2026  
**Author:** FocusFlow Development Team  
**Status:** Version 1.0 (Development Phase)

---

## 1. 📌 Introduction

### 1.1 Project Overview
**FocusFlow** is a comprehensive, hybrid productivity platform designed to bridge the gap between academic management and personal productivity. By integrating the core functionalities of Google Classroom (assignment management), Microsoft Planner (project organization), and Google Meet (synchronous learning), FocusFlow provides a unified workspace for students and educators.

### 1.2 Objectives
*   **Centralization:** Eliminate the "tab fatigue" caused by switching between multiple educational tools.
*   **Aesthetic Engagement:** Utilize modern design principles (Glassmorphism, Dark Mode) to reduce cognitive load and enhance user satisfaction.
*   **Efficiency:** Streamline the assignment lifecycle from creation to grading through a responsive and intuitive interface.
*   **Scalability:** Build a robust architectural foundation capable of supporting future AI-driven features.

### 1.3 Problem Statement
Current educational ecosystems are fragmented. Students often manage assignments in one app, personal tasks in another, and attend live sessions in a third. This fragmentation leads to:
1.  **Missed Deadlines:** Difficulty in tracking cross-platform dates.
2.  **Context Switching:** Reduced productivity due to frequent platform hopping.
3.  **Inconsistent UX:** Varying interfaces create a steep learning curve for new users.

---

## 2. 🏗️ System Architecture

### 2.1 High-Level Architecture
FocusFlow follows a decoupled **MERN Stack** architecture, ensuring a clean separation between the user interface and data persistence layers.

### 2.2 Frontend Structure (React.js)
The frontend is built with **React (Vite)**, focusing on a component-based architecture:
*   **State Management:** Utilizes **React Context API** for global states (Authentication, Theme, Achievements).
*   **Routing:** Managed by `react-router-dom` for seamless SPA transitions.
*   **Styling:** Pure **Custom CSS** for high-precision design control without the overhead of utility frameworks.

### 2.3 Backend Structure (Node.js/Express)
The planned backend follows the **MVC (Model-View-Controller)** pattern:
*   **Express.js:** Handles routing and middleware (JWT authentication, validation).
*   **Mongoose:** Facilitates object data modeling for MongoDB.
*   **RESTful API:** Provides predictable endpoints for the frontend to consume.

### 2.4 Data Flow Explanation
1.  **Request:** User performs an action (e.g., submitting an assignment).
2.  **State Update:** Local React state provides immediate UI feedback (Optimistic UI).
3.  **API Call:** Service layer sends an asynchronous request to the Express backend.
4.  **Processing:** Backend validates the session, processes business logic, and persists data to MongoDB.
5.  **Response:** Backend returns the updated object, which updates the global Context/Local state.

---

## 3. 📁 Project Folder Structure

A standardized organization ensures maintainability and ease of scaling.

### 3.1 Frontend `/frontend/src`
*   `components/`: Reusable UI elements (Buttons, Cards, Modals).
*   `pages/`: Top-level route components (Dashboard, Assignments, Login).
*   `context/`: Global state providers for Auth, Theme, and user progress.
*   `services/`: API abstraction layer for backend communication.
*   `hooks/`: Custom React hooks for shared logic (e.g., `useAuth`).
*   `styles/`: CSS modules and global variables.
*   `utils/`: Helper functions (Date formatting, String manipulation).

### 3.2 Backend `/backend`
*   `models/`: Schema definitions for MongoDB.
*   `controllers/`: Request handling logic and database queries.
*   `routes/`: URL endpoint definitions.
*   `middleware/`: Authentication checks and error handling.
*   `config/`: Database connection strings and environment variables.

---

## 4. 🔄 Application Workflow

### 4.1 User Roles
*   **Teacher:** Can create batches, schedule live classes, and assign coursework.
*   **Student:** Can join batches, view assignments, and submit work.

### 4.2 Navigation Flow
`Login/Register` → `Dashboard` → `Sidebar Navigation` → `Module Selection` (Tasks/Assignments/Classes).

### 4.3 Assignment Workflow
1.  **Create:** Teacher fills a modal form (Title, Description, Due Date) to broadcast to a specific Batch.
2.  **View:** Students see new assignments in their feed with real-time status badges (Assigned/Submitted/Missing).
3.  **Submit:** Student uploads a solution/link via the Assignment detailed view.
4.  **Grade:** (Planned) Teacher reviews the list of submissions and provides feedback/grades.

---

## 5. 🧩 Module Breakdown

### 5.1 Dashboard
The nerve center of FocusFlow. It provides a visual summary of upcoming deadlines, recent achievements, and a productivity radar that tracks time spent on tasks.

### 5.2 Tasks System
A Microsoft Planner-inspired board for personal organization. Features include task categorization, priority levels, and dynamic progress bars.

### 5.3 Assignments System
A feed-based system similar to Google Classroom. It side-loads details for selected assignments, allowing for a "no-click" preview experience and integrated submission forms.

### 5.4 Classes / Meetings
Integrates live session scheduling. Users can join "Live Batches" with one click, utilizing the Google Meet API integration for synchronous learning without leaving the platform.

### 5.5 AI Assistant (Future)
An embedded chatbot trained on the user's submitted coursework and class notes to provide instant clarifications and academic support.

---

## 6. ⚙️ Feature Implementation Plan

The project follows a prioritized development roadmap:

1.  **Step 1: Layout & Core Design:** Establishing the Dark/Glassmorphism theme and sidebar navigation architecture.
2.  **Step 2: Assignment Feed:** Implementing the frontend UI for listing academic tasks with filtering logic.
3.  **Step 3: Submission System:** Building the forms and service logic to handle file/link uploads.
4.  **Step 4: Status Tracking:** Real-time logic to calculate "Missing" vs "Pending" states based on current timestamps.
5.  **Step 5: Role-based UI:** implementing conditional rendering to show different tools for Teachers vs Students.
6.  **Step 6: AI Integration:** Connecting a generative AI model to provide contextual help with assignments.

---

## 7. 📊 Data Structure Design

### 7.1 Assignment Object
```json
{
  "_id": "uuid",
  "title": "String",
  "description": "String",
  "batchId": "ObjectId (Ref: Batch)",
  "dueDate": "Date",
  "teacherId": "ObjectId (Ref: User)",
  "submissions": ["ObjectId (Ref: Submission)"]
}
```

### 7.2 Submission Object
```json
{
  "_id": "uuid",
  "studentId": "ObjectId (Ref: User)",
  "assignmentId": "ObjectId (Ref: Assignment)",
  "content": "String (Link or Text)",
  "submittedAt": "Date",
  "grade": "Number/Grade"
}
```

---

## 8. 🎨 UI/UX Design Approach

### 8.1 Visual Aesthetic
FocusFlow leverages a high-end **Dark Theme** to minimize eye strain during long study sessions.
*   **Colors:** Deep Navy (#0F172A), Vivid Purple (#8B5CF6) for highlights, and Soft White (#F8FAFC) for text.

### 8.2 Glassmorphism
Elements utilize semi-transparent backgrounds with `backdrop-filter: blur(12px)`. This creates a sense of depth and hierarchy, making the UI feel premium and modern.

### 8.3 Responsive Design
A mobile-first approach using Flexbox and CSS Grid ensures the platform is fully functional on smartphones, tablets, and desktops.

---

## 9. 🚀 Future Enhancements

*   **AI Lecture Summaries:** Automatically summarize recorded Google Meet sessions.
*   **Browser Notifications:** Push alerts for assignments due in less than 24 hours.
*   **Academic Analytics:** Visual graphs showing a student's progress and grade trends over time.

---

## 10. ⚠️ Challenges & Solutions

### 10.1 Layering (Z-Index)
**Challenge:** Modals and dropdowns were appearing behind the sidebar or being clipped by parent containers.
**Solution:** Implemented a standardized Z-index scale and utilized React Portals to render modals outside the parent DOM hierarchy.

### 10.2 State Handling
**Challenge:** Managing complex submission states across the dashboard and assignment pages.
**Solution:** Centralized task state in a custom hook and implemented "Optimistic UI" updates to make the platform feel instantaneous.

### 10.3 Performance
**Challenge:** Rendering large lists of assignments with glassmorphism effects causing frame drops.
**Solution:** Optimized CSS by limiting the use of heavy filters to top-level active elements and implementing React reconciliation optimizations.

---
*End of Documentation*
