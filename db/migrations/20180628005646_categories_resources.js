exports.up = function(knex, Promise) {  
  return Promise.all([
    knex.schema.createTable('categories_resources', function (table) {
      table.increments('unique_id');
      table.integer('category_id').unsigned().notNullable();
      table.integer('resource_id').unsigned().notNullable();
      
      table.foreign('category_id').references('category_id').inTable('categories'); 
      table.foreign('resource_id').references('resource_id').inTable('resources'); 
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('categories_resources')
  ])
};