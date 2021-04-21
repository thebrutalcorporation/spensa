import { testConn } from "./testConn";

testConn()
  .then(async (orm) => {
    const generator = orm.getSchemaGenerator();

    //clean up records first for each test run
    await generator.dropSchema();

    //generate schema
    await generator.createSchema();

    await orm.close(true);
  })
  .then(() => process.exit())
  .catch(console.log);
