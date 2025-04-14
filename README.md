# HTML Document Editor

A modern web-based platform for editing, formatting, and managing HTML documents with live preview, user dashboards, and admin control panel. Built with Next.js, React, and TypeScript.

---

## 🚀 Features & Functionalities

### 🧑‍💻 User Management
- Secure authentication with JWT
- Role-based access (Admin, User)
- Profile dashboard with session tracking
- Light/dark mode preference persistence

### ✍️ HTML Editing
- Monaco-based code editor
- Real-time HTML rendering preview
- Syntax highlighting and auto-completion
- Line breaks, indentation, and justification support

### 📂 File Management
- Save/load from browser localStorage
- Export as `.html`, `.txt`, `.docx`
- Import file and extract HTML content
- Download styled HTML documents

### 📊 Admin Dashboard
- Monitor user activity and document edits
- View all user accounts and usage data
- Access user documents and feedback
- System analytics and stats (optional)

### 🧑‍🎓 User Dashboard
- Track document history with timestamps
- Access recent edits and saved drafts
- View feedback submissions

### 💬 Feedback System
- User feedback collection and form
- Admin view and respond to feedback
- Status messaging for feedback tracking

### 🎨 UI/UX Features
- Responsive design (desktop/mobile)
- Dark/light theme toggle
- Toast notifications and loading indicators
- Intuitive navigation and clean layout

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15+
- **Library**: React 19+
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS
  - Shadcn/ui
  - Framer Motion (animations)
- **Editor**: Monaco Editor
- **Notifications**: React Hot Toast

### Utilities & File Handling
- `html-docx-js`, `file-saver`, `pdf-lib`
- LocalStorage for document persistence
- Optional support for Cloudinary & email (via Nodemailer)

---

## 🧩 Application Modules

1. **Authentication Module**  
   Secure registration, login, and JWT-based session handling

2. **Editor Module**  
   HTML code editing with syntax support and live preview pane

3. **File Management Module**  
   Save/load from localStorage and convert files between formats

4. **User Dashboard Module**  
   Profile view, edit history, and session activity tracking

5. **Admin Dashboard Module**  
   User management, document access, and system-level insights

6. **Feedback System**  
   Allow users to submit feedback and admins to review/manage it

7. **Theme System**  
   Supports light/dark themes with persisted user preference

8. **Navigation System**  
   Clean routing between app sections with page transitions

---


