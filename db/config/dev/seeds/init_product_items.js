/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('products')
    .del()
    .then(() => {
      return knex('products').insert(
        require('./data/products.json')
      )
    })
};
