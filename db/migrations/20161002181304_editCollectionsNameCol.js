
exports.up = function(knex, Promise) {
   return Promise.all([
    knex.schema.alterTable('collections', function(table) {
      table.renameColumn('name', 'collection_name');
    })
  ])
};

exports.down = function(knex, Promise) {
   return Promise.all([
    knex.schema.alterTable('collections', function(table) {
      table.renameColumn('collection_name', 'name');
    })
  ])
};
