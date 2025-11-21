<div align="center">

# 🚀 PDM TaskFlow

### Modern Task Management & Productivity Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?logo=supabase)](https://supabase.com/)

*Streamline your workflow, boost productivity, and collaborate seamlessly*

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

**PDM TaskFlow** is a comprehensive project management solution designed for modern teams. Built with React and TypeScript, it combines powerful features like Kanban boards, Gantt charts, and real-time analytics into an intuitive, responsive interface.

### ✨ Key Highlights

- 🎯 **Intuitive Task Management** - Create, organize, and track tasks effortlessly
- 📊 **Visual Analytics** - Real-time dashboards with insightful metrics
- 👥 **Team Collaboration** - Seamless multi-user workflows
- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 📱 **Responsive Design** - Works flawlessly on all devices

---

## 🎯 Features

### Core Functionality

- **📌 Task Management**
  - Create, edit, and delete tasks with ease
  - Priority levels (Low, Medium, High, Critical)
  - Status tracking (Todo, In Progress, Review, Done)
  - Due date management with overdue notifications
  - Tag-based organization

- **📈 Dashboard & Analytics**
  - Real-time task distribution charts
  - Team velocity metrics
  - Overdue task alerts
  - Active task overview
  - Performance insights

- **👤 User Management**
  - Secure authentication & authorization
  - User profiles with avatars
  - Role-based access control
  - Team member assignment

- **⏱️ Time Tracking**
  - Log time entries for tasks
  - Estimated vs actual time comparison
  - Productivity analytics

- **🎨 Modern UI/UX**
  - Dark mode interface
  - Smooth animations
  - Responsive design
  - Accessible components

---

## 🖼️ Demo

> *Screenshots and live demo coming soon*

---

## 🛠️ Tech Stack

### Frontend
- **[React](https://reactjs.org/)** (v18) - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool & dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Recharts](https://recharts.org/)** - Data visualization

### Backend & Services
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication & authorization
  - Row Level Security (RLS)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

---

## 📦 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase account** (free tier available)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Duy133009/PDM_TaskFlow.git
   cd PDM_TaskFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   > 💡 Get your Supabase credentials from [Supabase Dashboard](https://app.supabase.com/) → Project Settings → API

4. **Set up Supabase database**
   
   Run the following SQL in your Supabase SQL Editor:
   ```sql
   -- Create tables (schema provided in /database folder)
   -- Enable Row Level Security
   -- Set up authentication policies
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 🗂️ Project Structure

```
PDM_TaskFlow/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Login.tsx        # Authentication
│   ├── CreateTaskModal.tsx
│   └── ...
├── services/            # API & service layer
│   └── supabaseClient.ts
├── types.ts             # TypeScript type definitions
├── constants.ts         # App constants
├── App.tsx              # Root component
├── index.css            # Global styles
└── vite.config.ts       # Vite configuration
```

---

## 🚀 Usage

### Creating a Task
1. Click the **"New Task"** button
2. Fill in task details (title, description, priority, assignee)
3. Set due date and estimated time
4. Click **"Create Task"**

### Managing Tasks
- **Update Status**: Drag tasks between columns or use status dropdown
- **Edit**: Click on a task to open the edit modal
- **Delete**: Use the delete button on task cards
- **Mark as Done**: Quick action button on active tasks

### Viewing Analytics
- Navigate to the **Dashboard** for real-time insights
- View task distribution by status
- Monitor team velocity and overdue tasks

---

## 🔐 Authentication

PDM TaskFlow uses Supabase Authentication with the following features:

- ✅ Email/Password login
- ✅ User registration with email confirmation
- ✅ Secure session management
- ✅ Password reset functionality (optional)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Duy133009**

- GitHub: [@Duy133009](https://github.com/Duy133009)
- Project Link: [PDM_TaskFlow](https://github.com/Duy133009/PDM_TaskFlow)

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) - For the amazing backend platform
- [Vite](https://vitejs.dev/) - For the blazing fast build tool
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Lucide](https://lucide.dev/) - For the beautiful icons

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Duy133009

</div>
