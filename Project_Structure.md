# Project Structure Design: FocusFlow
## Scalable Architecture for Hybrid Productivity Platforms

This document outlines a professional, clean, and scalable project structure for **FocusFlow**. It is designed to be beginner-friendly while maintaining industry standards for React development.

---

## 1. 📂 Complete Folder Structure

Below is the recommended structure for your `src/` directory. This organization ensures that as your project grows (e.g., adding more assignment types or AI features), your codebase remains manageable.

```text
focusflow/
├── public/                 # Static assets (favicons, manifest)
├── src/
│   ├── assets/             # Images, SVGs, and Static files
│   ├── components/         # Reusable UI building blocks
│   │   ├── ui/             # Atomic components (Button, Input, Card)
│   │   ├── layout/         # Structural components (Sidebar, Navbar, Footer)
│   │   └── features/       # Feature-specific blocks (AssignmentItem, TaskRow)
│   ├── context/            # Global state (AuthContext, ThemeContext)
│   ├── hooks/              # Custom helper hooks (useAuth, useLocalStorage)
│   ├── pages/              # Full-page views (Dashboard, Assignments, Classes)
│   ├── services/           # API interaction layer (axios/fetch logic)
│   ├── styles/             # Modular CSS files
│   │   ├── base.css        # Resets, variables, and typography
│   │   ├── layout.css      # CSS for Sidebar/Navbar
│   │   └── components/     # Specific CSS for complex components
│   ├── utils/              # Helper functions (date formatting, calculation)
│   ├── App.jsx             # Main routing and provider setup
│   └── main.jsx            # Entry point
├── .gitignore
├── package.json
└── README.md
```

---

## 2. 🧩 Folder Explanation

### `components/`
This is your "Legoland." 
*   **ui/**: Simple, generic components that don't data-fetch. They receive props and look pretty.
*   **layout/**: Components that define the shell of your app (Sidebar/Navbar).
*   **features/**: More "intelligent" components related to specific logic (e.g., a `SubmissionModal.jsx`).

### `pages/`
Each file here represents a distinct URL in your app. Keep logic minimal here; use pages to assemble components.

### `services/`
Instead of using `fetch()` or `axios()` inside your components, put that logic here. This way, if your backend URL changes, you only update it in one place.

### `styles/`
Since you aren't using Tailwind, organization is key.
*   **base.css**: Define your "Design System" here (e.g., `--primary-color: #8B5CF6;`).
*   **components/**: Keep your component CSS separate to avoid one giant, unreadable file.

---

## 3. ⚙️ Development Flow (Build Order)

Follow this sequence to build FocusFlow without getting overwhelmed:

### Step 1: Design System & Variables (`styles/base.css`)
Define your colors, fonts, and "Glassmorphism" utility classes first. This ensures consistency across the app.

### Step 2: The Shell (`components/layout/`)
Build the **Sidebar** and **Main Content Area**. This gives you a visual container for everything else.

### Step 3: Routing & Navigation (`App.jsx`)
Setup your routes (Dashboard, Assignments, etc.). Even if the pages are empty, you should be able to click sidebar links to change the URL.

### Step 4: The Hub (`pages/Dashboard.jsx`)
Create the Dashboard with dummy "Stat Cards." This is the first thing users see and sets the mood for the app.

### Step 5: Core Feature: Assignments (`pages/Assignments.jsx`)
Build the list/feed system first, then the detail view, and finally the submission form.

### Step 6: Productivity Features (`pages/Tasks.jsx`)
Implement the personal To-Do system once the academic modules are stable.

---

## 4. 🔄 Feature Structure (Organization Tips)

To keep features like **Assignments** and **Tasks** scalable:

*   **Logic in Services**: Put `getAssignments()` and `submitWork()` in `services/assignmentService.js`.
*   **State in Context**: If you need to share "Current Assignment" across multiple pages, use a Context provider.
*   **Styles in Components**: Create `AssignmentCard.css` next to `AssignmentCard.jsx` if it has unique styles.

---

## 5. 📌 Best Practices

### ✅ Naming Conventions
*   **Components**: Use `PascalCase.jsx` (e.g., `SidebarItem.jsx`).
*   **Folders**: Use `kebab-case` or `lowercase` (e.g., `ui-elements/`).
*   **Functions**: Use `camelCase` (e.g., `handleSubmit`).

### ✅ File Organization
*   **The 300-Line Rule**: If a component exceeds 300 lines of code, it's time to break it into smaller sub-components.
*   **Index files**: Inside `components/ui/`, you can use an `index.js` to export everything, making imports cleaner: 
    *   `import { Button, Card } from '../components/ui';`

### ❌ Common Mistakes to Avoid
1.  **Avoid "Prop Drilling"**: Don't pass data through 5 levels of components. If it's used everywhere, use Context.
2.  **Don't put everything in App.jsx**: Keep the main file clean. Move route definitions to a separate file if they get too many.
3.  **No Logic in CSS**: Use CSS variables for themes instead of writing duplicate classes for dark/light mode.

---
*Follow this structure to build a FocusFlow that is easy to debug and a joy to expand!*
