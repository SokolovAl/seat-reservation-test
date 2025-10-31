import 'dotenv/config';
import express from 'express';
import bookingRoutes from './routes/bookingRouter.js';
import knex from './db.js';

const app = express();
app.use(express.json());

app.use('/api/bookings', bookingRoutes);

async function initDatabase() {
    console.log('Running database migrations...');
    await knex.migrate.latest();

    console.log('Seeding database...');
    await knex.seed.run();

    console.log('Database ready ✅');
}

async function startServer() {
    try {
        await initDatabase();

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`API running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
