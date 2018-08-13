exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('resources', function (table) {
      table.increments('resource_id');
      table.string('url');
      table.string('title');
      table.text('description');
      table.string('image_url');
      table.integer('creator_id').unsigned().notNullable();;
      table.foreign('creator_id').references('id').inTable('users');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('resources')
  ])
};
