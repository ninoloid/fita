/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const knex = require('knex');

exports.up = function(knex) {
  return knex.schema.createTable('cart_products', (table) => {
    table.uuid('id').primary();
    table.uuid('cart_id').references('id').inTable('carts').notNullable();
    table.uuid('product_id').references('id').inTable('products').notNullable();

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
  return knex.schema.dropTable('cart_products');
};
