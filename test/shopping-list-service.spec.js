const { expect } = require("chai")

const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe('Shopping list service object', function() {
  let db

  let testItems = [
    {
      id: 1,
      name: 'test item one',
      price: "5.99",
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    },
    {
      id: 2,
      name: 'test item two',
      price: "6.99",
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: false,
      category: 'Snack'
    },
    {
      id: 3,
      name: 'test item three',
      price: "7.99",
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      checked: false,
      category: 'Lunch'
    }
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
  })

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())

  after(() => db.destroy())

  context('Given "shopping_list" has data', () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems)
    })

    it('getAllItems() resolves all items from "shopping_list" table', () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testItems)
        })
    })

    it('getById() resolves an item by id from "shopping_list" table', () => {
      const thirdId = 3
      const thirdTestItem = testItems[thirdId - 1]
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdTestItem.name,
            price: thirdTestItem.price,
            date_added: thirdTestItem.date_added,
            checked: thirdTestItem.checked,
            category: thirdTestItem.category
          })
        })
    })

    it('deleteItem() removes an item from "shopping_list" table by id', () => {
      const itemId = 3
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const expected = testItems.filter(item => item.id !== itemId)
          expect(allItems).to.eql(expected)
        })
    })

    it('updateItem() updates an item from the "shopping_list" table', () => {
      const idOfItemToUpdate = 3
      const newItemData = {
        name: 'Updated name',
        price: '4.23',
        date_added: new Date(),
        checked: true,
        category: 'Snack'
      }
    })
  })

  context('Given "shopping_list" has NO data', () => {
    it('getAllItems() resolves an empty array', () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    it('insertItem() inserts a new item and resolves the new item with an id', () => {
      const newItem = {
        name: 'new shopping item',
        price: '2.99',
        date_added: new Date('2020-01-01T00:00:00.000Z'),
        checked: false,
        category: 'Lunch'
      }
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: newItem.date_added,
            checked: newItem.checked,
            category: newItem.category
          })
        })
    })
  })
})