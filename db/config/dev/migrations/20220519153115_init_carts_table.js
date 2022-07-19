/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const knex = require('knex');

exports.up = function(knex) {
  return knex.schema.createTable('carts', (table) => {
    table.uuid('id').primary();
    table.float('total_price').notNullable();
    table.boolean('checked_out').notNullable().defaultTo(false);
    table.boolean('paid').notNullable().defaultTo(false);

    table
      .timestamp('created_at', {useTz: true})
      .defaultTo(knex.fn.now())
      .notNullable();
    table
      .timestamp('updated_at', {useTz: true})
      .defaultTo(knex.fn.now())
      .notNullable();
    table.timestamp('deleted_at', {useTz: true});
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('carts');
};
