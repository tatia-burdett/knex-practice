const { format } = require('morgan')

const ShoppingListService = {
  // GET
  getAllItems(knex) {
    return knex.select('*').from('shopping_list')
  },
  // INSERT
  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  //
  getById(knex, id) {
    return knex.from('shopping_list').select('*').where('id', id).first()
  },
  // DELETE
  deleteItem(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .delete()
  },
  // Update
  updateItem(knex, id, newItemFields) {
    return knex('shopping_list')
      .where({ id })
      .update(newItemFields)
  }
}

module.exports = ShoppingListService