import connectDB from './db/index.js';
import app from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './websocket/socketHandler.js';
import dotenv from 'dotenv'

dotenv.config({
    path: './.env',
})

// Connect to the database
await connectDB()
 
// Create an HTTP server and attach the Express app to it
// This is necessary for Socket.IO to work with Express
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173 || https://bolum-eight.vercel.app/',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the Socket.IO server!',
  });
});

// Serve React app (after API routes)
import path from 'path'
import { fileURLToPath } from 'url'

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})


// This function will handle the socket events and logic ( Setup Socket.IO )
setupSocket(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});