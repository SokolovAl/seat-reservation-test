/** @param {import('knex').Knex} knex */
export async function seed(knex) {
    await knex('bookings').del();
    await knex('events').del();

    await knex('events').insert([
        { name: 'Node.js Meetup', total_seats: 3 },
        { name: 'JavaScript Workshop', total_seats: 2 },
        { name: 'TypeScript Intro', total_seats: 5 },
    ]);
}
