import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import transportRoutes from './routes/transport';
import pool from './db';

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Default route for /
app.get('/', (req, res) => {
  res.send('🚚 Transport API is running!');
});

// Use transport routes under /transport
app.use('/transport', transportRoutes);

// Test DB connection
(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connected to Neon DB. Server time:', result.rows[0].now);
  } catch (err) {
    console.error('❌ Failed to connect to Neon DB:', err);
  }
})();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
