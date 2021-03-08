require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

// Drill #1
function getItemByTextName(searchTerm) {
  knexInstance
    .select('name', 'price', 'category')
    .from('shopping_list')
    .where('name', 'ILIKE', `${searchTerm}`)
    .then(result => {
      console.log('Search Term', { searchTerm })
      console.log(result)
    })
}

getItemByTextName('dog')

// Drill #2 
function getPaginatedItems(pageNumber) {
  const perPage = 6
  const offset = perPage * (pageNumber - 1)
  knexInstance
    .select('name', 'price', 'category')
    .from('shopping_list')
    .limit(perPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

getPaginatedItems(3)

// Drill #3
function getItemAfterDate(daysAgo) {
  knexInstance
    .select('name', 'price', 'date_added', 'category')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log(result)
    })
}

getItemAfterDate(5)

// Drill #4
function getTotalCostPerCategory() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log(result)
    })
}

getTotalCostPerCategory()