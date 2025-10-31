import 'dotenv/config';
import express from 'express';
import bookingRoutes from './routes/bookingRouter.js';

const app = express();
app.use(express.json())

app.get('/health', (_req, res) => {
    res.json({ ok: true });
});

app.use('/api/bookings', bookingRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
