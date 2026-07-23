# ChatFlow Architecture

## Overview

ChatFlow is a real-time messaging application built using a modern full-stack architecture.

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Axios

### Backend
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Socket.IO

---

# System Architecture

Client
    │
    ▼
Next.js Frontend
    │
 REST API / Socket.IO
    │
    ▼
Express Server
    │
 Prisma ORM
    │
    ▼
PostgreSQL Database

---

# Authentication Flow

User Login
    │
    ▼
JWT Generated
    │
    ▼
Stored in Cookie
    │
    ▼
Protected Routes

---

# Messaging Flow

User Types Message
        │
        ▼
Frontend Validation
        │
        ▼
POST /messages
        │
        ▼
Express Controller
        │
        ▼
Prisma
        │
        ▼
PostgreSQL
        │
        ▼
Return Message
        │
        ▼
Update UI

---

# Planned Real-Time Flow

User Sends Message
        │
        ▼
Socket.IO Emit
        │
        ▼
Server Broadcast
        │
        ▼
Recipient Receives Message
        │
        ▼
UI Updates

---

# Folder Structure

frontend/
backend/

backend/
├── src/
│   ├── controllers
│   ├── middleware
│   ├── prisma
│   ├── routes
│   ├── socket
│   └── utils

frontend/
├── app
├── components
├── hooks
├── lib
└── types

---

# Future Improvements

- Typing indicator
- Online status
- Read receipts
- File uploads
- Notifications
- Docker
- Deployment