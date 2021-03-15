import knex1 from "knex";

export const knex = knex1({
  client: "sqlite3",
  connection: {
    filename: process.env.PJS_DBFILE,
  },
  useNullAsDefault: true,
});

async function fixdb() {
  if (!(await knex.schema.hasTable("tags"))) {
    await knex.schema.createTable("tags", (t) => {
      t.increments("id");
      t.string("name");
      t.json("data");
    });
  }
}

fixdb();
