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
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the Socket.IO server!',
  });
});


// This function will handle the socket events and logic ( Setup Socket.IO )
setupSocket(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});