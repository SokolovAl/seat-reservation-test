export async function up(knex) {
    await knex.schema.createTable('events', (t) => {
        t.increments('id').primary();
        t.string('name').notNullable();
        t.integer('total_seats').notNullable();
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('events');
}
