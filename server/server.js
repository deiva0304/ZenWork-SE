import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";
import journalRouter from "./routes/journalRoutes.js";  
import pixelRoutes from './routes/pixelRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://zenwork-workplace-wellness-fawn.vercel.app', // Your Vercel frontend URL
  'https://www.zenwork.app' // Add any additional domains
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin 
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

//API Endpoints
app.get('/', (req, res)=> res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/journal', journalRouter); 
app.use('/api/pixel', pixelRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.listen(port, ()=> console.log(`Server started at PORT:${port}`));