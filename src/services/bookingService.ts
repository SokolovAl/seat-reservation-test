import db from '../db.js';

export async function reserveSeat(event_id, user_id) {
    const event = await db('events').where({ id: event_id }).first();
    if (!event) throw new Error('Event not found');

    const { count } = await db('bookings')
        .where({ event_id })
        .count({ count: 'id' })
        .first();
    if (Number(count) >= event.total_seats) throw new Error('No seats available');

    try {
        const [booking] = await db('bookings')
            .insert({ event_id, user_id })
            .returning('*');
        return booking;
    } catch (err) {
        if (err.code === '23505') throw new Error('User already booked this event');
        throw err;
    }
}
