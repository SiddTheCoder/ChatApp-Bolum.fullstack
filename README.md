
# 💬 Real-Time Chat Application

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Socket.IO](https://img.shields.io/badge/Real--Time-Socket.IO-yellow)
![License: MIT](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

A full-stack real-time chat application built with modern web technologies, supporting seamless user authentication, real-time messaging, and a fully responsive, intuitive interface.

---

## 🌟 Features

### 🔒 Authentication & User Management
- Secure user registration and login
- Password encryption with bcrypt
- Protected routes and JWT-based authentication
- User profile and account management

### 🗨️ Chat System
- Real-time messaging via WebSocket (Socket.IO)
- One-on-one private chats (room-based architecture)
- Message persistence with MongoDB
- Online/offline user status
- Read receipts and typing indicators
- Notifications on user join and new messages

### 🎨 User Interface
- Responsive and mobile-friendly design
- Modern, clean UI built with Tailwind CSS
- Real-time updates and dynamic navigation
- Smooth transitions between chat rooms

---

## 🛠️ Tech Stack

### Frontend
- **React.js** – Component-based UI
- **React Router** – Client-side routing
- **Socket.io-client** – Real-time WebSocket connection
- **Tailwind CSS** – Utility-first CSS framework
- **Context API** – Global state management
- **Axios** – API requests

### Backend
- **Node.js** – Server-side runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **Socket.IO** – Real-time bidirectional communication
- **JWT (JSON Web Tokens)** – Secure authentication
- **Bcrypt** – Password hashing

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/SiddTheCoder/ChatApp-Bolum.fullstack.git


## 🌟 Features

### Authentication & User Management
- User registration and login system
- Secure password hashing
- Protected routes and authentication middleware
- User profile management

### Chat Features
- Real-time messaging using WebSocket technology
- One-on-one chat functionality
- Message history and persistence
- Online/offline status indicators
- Message read receipts
- Typing indicators

### User Interface
- Modern and responsive design
- Clean and intuitive user experience
- Mobile-friendly interface
- Real-time updates and notifications
- Smooth navigation between different sections

## 🛠️ Tech Stack

### Frontend
- React.js - Frontend framework
- React Router - Client-side routing
- Socket.io-client - Real-time communication
- Tailwind CSS - Styling and responsive design
- Context API - State management
- Axios - HTTP client for API requests

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM for MongoDB
- Socket.io - Real-time bidirectional communication
- JWT - Authentication
- Bcrypt - Password hashing

## 📦 Installation

1. Clone the repository:
```bash
git clone [https://github.com/SiddTheCoder/ChatApp-Bolum.fullstack.git]
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add necessary environment variables (MongoDB URI, JWT secret, etc.)

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm run dev
```

## 🔧 Configuration

### Backend Configuration
Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend Configuration
The frontend is configured to connect to the backend server. Update the API base URL in the frontend configuration if needed.

## 🚀 Deployment

The application can be deployed on various platforms:
- Frontend: Vercel, Netlify, or any static hosting service
- Backend: Heroku, DigitalOcean, or any Node.js hosting service
- Database: MongoDB Atlas or any MongoDB hosting service

## 📝 Project Structure

```
ChatApp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── private/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
└── backend/
    ├── src/
    │   ├── db/
    │   ├── models/
    │   ├── routes/
    │   └── controllers/
    └── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- [Your Name]

## 🙏 Acknowledgments

- Thanks to all contributors and open-source projects that made this possible
- Special thanks to the development community for their support and resources
