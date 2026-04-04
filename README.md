# CSPAPP Frontend - Church Management System

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)

## 📋 Overview

CSPAPP Frontend is a modern, responsive church management application built with React 18 and TypeScript. It provides a seamless experience for church members and administrators to manage donations, events, profiles, and communications.

## ✨ Features

### For Members
- 🔐 **Authentication** - Secure login and registration
- 👤 **Profile Management** - View and edit personal information
- 💰 **Online Donations** - Make donations via Paystack
- 📊 **Donation History** - Track all donations with printable receipts
- 📅 **Events** - View and register for church events
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Mode** - Toggle between light and dark themes

### For Administrators
- 📊 **Dashboard** - Real-time analytics and statistics
- 👥 **Member Management** - CRUD operations on members
- 💵 **Donation Management** - View all donations and export to CSV
- 📆 **Event Management** - Create, edit, and delete events
- 📧 **Communications** - Send mass emails and SMS
- 🎂 **Automated Birthday Wishes** - Auto-send birthday messages
- 📈 **Reports** - Export data to CSV format

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router v6.20
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table v8
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **UI Components**: Custom components with shadcn/ui inspiration
- **State Management**: React Context API
- **HTTP Client**: Axios (for backend integration)
- **Notifications**: Sonner

## 📁 Project Structure


cspapp-frontend/
├── src/
│ ├── components/
│ │ ├── layout/
│ │ │ ├── Sidebar.tsx
│ │ │ ├── Navbar.tsx
│ │ │ ├── Layout.tsx
│ │ │ └── Footer.tsx
│ │ ├── ui/
│ │ │ ├── LoadingSpinner.tsx
│ │ │ ├── Modal.tsx
│ │ │ ├── PaymentModal.tsx
│ │ │ └── ReceiptModal.tsx
│ │ ├── forms/
│ │ │ ├── Input.tsx
│ │ │ ├── Select.tsx
│ │ │ └── TextArea.tsx
│ │ └── tables/
│ │ └── DataTable.tsx
│ ├── pages/
│ │ ├── auth/
│ │ │ ├── Login.tsx
│ │ │ └── Register.tsx
│ │ ├── member/
│ │ │ ├── Dashboard.tsx
│ │ │ ├── Profile.tsx
│ │ │ ├── Donate.tsx
│ │ │ ├── DonationHistory.tsx
│ │ │ └── Events.tsx
│ │ └── admin/
│ │ ├── AdminDashboard.tsx
│ │ ├── Members.tsx
│ │ ├── Donations.tsx
│ │ ├── EventsManagement.tsx
│ │ ├── Communications.tsx
│ │ └── AdminProfile.tsx
│ ├── context/
│ │ ├── AuthContext.tsx
│ │ └── ThemeContext.tsx
│ ├── services/
│ │ └── api.ts
│ ├── types/
│ │ └── index.ts
│ ├── utils/
│ │ ├── helpers.ts
│ │ └── validations.ts
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
├── public/
│ └── cross-icon.svg
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md


## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Step 1: Clone the repository
```bash
git clone https://github.com/your-repo/cspapp-frontend.git
cd cspapp-frontend


npm install

Create a .env file in the root directory:

env
VITE_API_URL=http://localhost:5000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx

npm run dev