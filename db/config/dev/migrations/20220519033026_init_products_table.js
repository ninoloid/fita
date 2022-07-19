/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const knex = require('knex');

exports.up = function(knex) {
  return knex.schema.createTable('products', (table) => {
    table.uuid('id').primary();
    table.string('sku').notNullable();
    table.string('name').notNullable();
    table.float('price').notNullable();
    table.float('quantity').notNullable();

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
  return knex.schema.dropTable('products');
};
