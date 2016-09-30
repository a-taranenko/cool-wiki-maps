
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
        table.string('username');
        table.string('password');
        table.string('email');
        table.integer('uid').unique();
        table.timestamps('created');
      }),
    knex.schema.createTable('collections', function(table) {
      table.increments('id').primary();
      table.integer('owner_id');
      table.string('name');
      table.string('desc');
      table.json('markers');
      table.integer('cid').unique();
      table.timestamps('created');
      }),
    knex.schema.createTable('users_collections', function(table) {
      table.integer('uid');
      table.foreign('uid').references('users.uid');
      table.integer('cid');
      table.foreign('cid').references('collections.cid');
      table.index(['uid','cid'], 'users_collections_index');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('users', function(table) {
      table.dropColumn('usename');
      table.dropColumn('password');
      table.dropColumn('email');
      table.dropColumn('uid');
      table.dropColumn('created');
    }),
    knex.schema.dropTable('collections'),
    knex.schema.dropTable('users_collections')
  ])
};
