const knex = require("knex");

const db = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    database: "db",
  },
});

function upsert(table, data) {
  return db(table).insert(data).onConflict().merge();
}

Promise.all([
  upsert("test", { id: 1, foo: JSON.stringify([1, 2, 3]) }),
  upsert("test", { id: 2, foo: JSON.stringify({ 1: 2, 3: 4 }) }),
]);
