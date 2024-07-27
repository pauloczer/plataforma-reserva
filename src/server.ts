import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import reservationRoutes from './routes/reservationRoutes';


dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
