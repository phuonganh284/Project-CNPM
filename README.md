# Library Management System

Hệ thống quản lý thư viện với Frontend (React + Vite) và Backend (Node.js + Express + PostgreSQL).

## 📁 Cấu trúc project

```
Project-CNPM/
├── FE/                  # Frontend (React + Vite)
│   ├── src/
│   └── package.json
└── BE/                  # Backend (Node.js + Express)
    ├── src/
    ├── database/
    └── package.json
```

## 🚀 Hướng dẫn setup

### Frontend

```bash
cd FE
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

### Backend

```bash
cd BE
npm install
npm run dev
```

Backend chạy tại: `http://localhost:5000`

**Xem chi tiết:** `BE/TEAM_SETUP_GUIDE.md`

## 📚 Tài liệu

- **BE/BACKEND_TASK_DIVISION.md** - Phân chia công việc backend
- **BE/FE_BE_INTEGRATION.md** - Hướng dẫn kết nối FE-BE
- **BE/TEAM_SETUP_GUIDE.md** - Hướng dẫn setup cho team
- **BE/database/SUPABASE_GUIDE.md** - Hướng dẫn setup Supabase

## 👥 Team

- 6 thành viên
- Phân chia theo modules (xem BACKEND_TASK_DIVISION.md)

## 🛠️ Tech Stack

**Frontend:**
- React
- Vite
- TailwindCSS
- React Router

**Backend:**
- Node.js
- Express.js
- PostgreSQL (Supabase)
- JWT Authentication

## 📝 License

MIT
