exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('categories', function (table) {
      table.increments('category_id');
      table.string('category');
      table.date('created_on');
      table.date('updated_on');

    })
  ])
};

exports.down = function(knex, Promise){
  return Promise.all([
    knex.schema.dropTable('categories')
  ])
};
