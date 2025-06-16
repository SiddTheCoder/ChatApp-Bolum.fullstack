# 💬 Real-Time Chat Application – Bolum

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Socket.IO](https://img.shields.io/badge/Real--Time-Socket.IO-yellow)
![OpenAI](https://img.shields.io/badge/AI-OpenAI-blueviolet)
![License: MIT](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

**Bolum** is a full-stack real-time chat application enhanced with an AI-powered mentor, built using modern technologies like React, Node.js, MongoDB, and Socket.IO.

---

## 🌟 Features

### 🔐 Authentication & User Management
- Secure sign-up and login
- Password encryption using bcrypt
- JWT-based route protection
- User profile and account settings

### 🗨️ Chat System
- Real-time messaging via Socket.IO
- One-on-one and group chat support
- Room-based architecture with user status
- Typing indicators, read receipts
- Join/leave notifications
- Media sharing (images/files)
- Persistent message history

### 🧠 AI Mentor (OpenAI Integration)
- In-app mentor bot that helps with code errors and tips
- Powered by OpenAI's GPT models
- Helpful for dev-focused chat environments

### 🎨 UI/UX
- Fully responsive modern UI
- Built with Tailwind CSS
- Smooth animations, auto scroll, typing effects
- Real-time updates and clean navigation

---
## 📸 Screenshots

<p align="center">
  <img src="https://res.cloudinary.com/dizjttfx3/image/upload/fl_preserve_transparency/v1750083976/Screenshot_94_bidlmu.jpg?_s=public-apps" width="300" alt="Screenshot 3"/>
  <img src="https://res.cloudinary.com/dizjttfx3/image/upload/fl_preserve_transparency/v1750083975/Screenshot_95_aqnacq.jpg?_s=public-apps" width="300" alt="Screenshot 1"/>
  <img src="https://res.cloudinary.com/dizjttfx3/image/upload/fl_preserve_transparency/v1750083971/Screenshot_99_qfyglb.jpg?_s=public-apps" width="300" alt="Screenshot 2"/>
  <br/>
  <img src="https://res.cloudinary.com/dizjttfx3/image/upload/fl_preserve_transparency/v1750083972/Screenshot_97_pxc3lc.jpg?_s=public-apps" width="300" alt="Screenshot 4"/>
  <img src="https://res.cloudinary.com/dizjttfx3/image/upload/fl_preserve_transparency/v1750083975/Screenshot_96_fujlhu.jpg?_s=public-apps" width="300" alt="Screenshot 5"/>
  <img src="https://res.cloudinary.com/dizjttfx3/image/upload/fl_preserve_transparency/v1750083975/Screenshot_93_kawhvs.jpg?_s=public-apps" width="300" alt="Screenshot 6"/>
  <br/>
  <img src="https://res.cloudinary.com/dizjttfx3/image/upload/fl_preserve_transparency/v1750083973/Screenshot_92_e6qwnh.jpg?_s=public-apps" width="300" alt="Screenshot 7"/>
</p>

---



## 🛠️ Tech Stack

| Layer         | Technology                                |
|---------------|-------------------------------------------|
| Frontend      | React, Socket.IO-client, Context API      |
| UI/CSS        | Tailwind CSS                              |
| Backend       | Node.js, Express, Socket.IO               |
| Database      | MongoDB + Mongoose                        |
| Auth          | JWT, Bcrypt                               |
| AI Mentor     | OpenAI API (`openai` npm package)         |
| Media Storage | Cloudinary / Local FS                     |
| HTTP Client   | Axios                                     |
| Deployment    | Vercel / Netlify (frontend), Heroku / Render (backend) |

---

## 📁 Project Structure

```
ChatApp-Bolum/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── websocket/
│   └── index.js / server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
├── ai-mentor/
│   └── mentor.js
├── .env
├── README.md
```

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/SiddTheCoder/ChatApp-Bolum.fullstack.git
cd ChatApp-Bolum.fullstack
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure environment variables

#### backend/.env

```ini
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
```

#### frontend/.env

```ini
REACT_APP_API_URL=http://localhost:5000
```

### 4. Start development servers

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 AI Mentor Usage

Once logged in, users can:
- Ask the built-in AI Mentor for help debugging code
- Get suggestions for error fixes
- Explore code improvements

💡 **Prompt example**:  
> "Why is my useEffect hook running infinitely in React?"

---

## 🚀 Deployment

- **Frontend**: Deploy `frontend/build/` to Netlify or Vercel.
- **Backend**: Deploy Node server to Render, Railway, or Heroku.
- **Database**: Use MongoDB Atlas.

> ✅ Make sure to configure environment variables securely on the deployment platform.

---

## 🤝 Contributing

We welcome contributions!

1. Fork the project  
2. Create a new branch (`git checkout -b feature/my-feature`)  
3. Commit your changes  
4. Open a pull request  

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👥 Author

- **Siddhant Yadav** – [GitHub](https://github.com/SiddTheCoder)

---

## 🙏 Acknowledgments

- OpenAI for AI mentorship APIs  
- Socket.IO for real-time communication  
- All open-source contributors and devs  

---

**Made with ❤️ by SiddTheCoder**
