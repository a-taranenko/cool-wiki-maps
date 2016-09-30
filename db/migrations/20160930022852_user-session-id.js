
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.string('session_id').index();
      table.unique(['session_id', 'username']);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.shema.alterTable('users', function(table) {
      table.dropIndex('session_id');
      table.dropColumn('session_id');
      table.dropUnique(['session_id', 'username'])
    })
  ])
};
