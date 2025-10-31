export async function up(knex) {
    await knex.schema.createTable('bookings', (t) => {
        t.increments('id').primary();
        t
            .integer('event_id')
            .notNullable()
            .references('id')
            .inTable('events')
            .onDelete('CASCADE');
        t.string('user_id').notNullable();
        t.timestamp('created_at').defaultTo(knex.fn.now());

        t.unique(['event_id', 'user_id']); // запретить двойное бронирование
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('bookings');
}
