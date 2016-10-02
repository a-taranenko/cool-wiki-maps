
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('collections', function(table) {
      table.dropColumn('markers');
    }),
    knex.schema.createTable('markers', function(table) {
      table.increments('id');
      table.integer('cid');
      table.foreign('cid').references('collections.cid');
      table.json('marker');
    })
  ]);
};

exports.down = function(knex, Promise) {

};
