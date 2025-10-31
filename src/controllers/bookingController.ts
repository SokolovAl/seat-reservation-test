import { reserveSeat } from '../services/bookingService.js';

export async function reserve(req, res) {
    const { event_id, user_id } = req.body || {};
    if (!event_id || !user_id) {
        return res.status(400).json({ error: 'event_id and user_id required' });
    }

    try {
        const booking = await reserveSeat(event_id, user_id);
        return res.status(201).json({ success: true, booking });
    } catch (err) {
        if (err.message === 'User already booked this event') {
            return res.status(409).json({ error: err.message });
        }
        if (err.message === 'No seats available') {
            return res.status(400).json({ error: err.message });
        }
        if (err.message === 'Event not found') {
            return res.status(404).json({ error: err.message });
        }
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
