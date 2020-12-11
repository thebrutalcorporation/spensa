import { testConn } from "./testConn";

testConn()
  .then(async (orm) => {
    const generator = orm.getSchemaGenerator();

    //clean up database
    await generator.dropSchema();

    //regenerate schema with no records
    await generator.createSchema();
  })
  .then(() => process.exit())
  .catch(console.log);
