const knex = require('knex');
/**;
 *
 * @param {knex} knex
 */
module.exports.up = function up(knex) {
  return knex.schema.table('cart_products', (table) => {
    table.integer('quantity').after('product_id');
  });
};

/**
 *
 * @param {knex} knex
 */
module.exports.down = function down(knex) {
  return knex.schema.table('cart_products', (table) => {
    table.dropColumn('quantity');
  });
};
