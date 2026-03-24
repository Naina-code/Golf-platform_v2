import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from "./backend/routes/adminRoutes.js";

app.use("/api/admin", adminRoutes);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Golf Platform Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});