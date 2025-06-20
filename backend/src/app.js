import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()

//middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true ,
}))

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(cookieParser())


//import routes
import userRoutes from './routes/user.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import chatMessageRoutes from './routes/chatMessage.routes.js'
import chatRoutes from './routes/chat.routes.js'
// import openaiChatRoutes from './routes/openai.routes.js'

//use routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/notification', notificationRoutes)
app.use('/api/v1/chatMessage', chatMessageRoutes)
app.use('/api/v1/chat', chatRoutes)




// Uncomment the following lines if you want to use OpenAI routes
import aiRoutes from './routes/openai.routes.js';
app.use('/api/ai', aiRoutes);



app.get('/ping', (req, res) => {
  res.json({
    message: 'OK',
    uptime: process.uptime(), // in seconds
    timestamp: new Date()
  });
});




export default app