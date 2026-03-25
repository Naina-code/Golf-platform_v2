import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './backend/authRoutes.js';
import adminRoutes from './backend/adminRoutes.js';
import scoreRoutes from './backend/scoreRoutes.js';
import drawRoutes from './backend/drawRoutes.js';
import userRoutes from './backend/userRoutes.js';
import subscriptionRoutes from './backend/subscriptionRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/draw', drawRoutes);
app.use('/api/user', userRoutes);
app.use('/api/subscription', subscriptionRoutes);

app.get('/', (req, res) => {
  res.send('Golf Platform Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
