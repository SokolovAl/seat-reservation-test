/** @param {import('knex').Knex} knex */
export async function seed(knex) {
    const events = await knex('events').select('id', 'name').orderBy('id', 'asc');
    if (!events.length) return;

    const [e1, e2] = events;

    await knex('bookings').insert([
        { event_id: e1.id, user_id: 'user123' },
        { event_id: e1.id, user_id: 'user456' },
        { event_id: e2.id, user_id: 'user123' },
    ]);
}
