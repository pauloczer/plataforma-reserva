import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // Importando o middleware CORS
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import reservationRoutes from './routes/reservationRoutes';

dotenv.config();

const app = express();

// Configurando o middleware CORS
app.use(cors({
  origin: 'http://localhost:3000',  // Permitir requisições do frontend (ajuste conforme necessário)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
