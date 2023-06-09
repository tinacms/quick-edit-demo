import { TinaLevelClient, createDatabase } from "@tinacms/datalayer";
import { MongodbLevel } from "mongodb-level";

const mongodbLevelStore = new MongodbLevel<string, Record<string, any>>({
  collectionName: "tinacms",
  dbName: "tinacms",
  mongoUri: process.env.MONGODB_URI as string,
});
// const tinaLevel = new TinaLevelClient()
// tinaLevel.openConnection()
const database = createDatabase({
  level: mongodbLevelStore,
  onPut: async () => {},
  onDelete: async () => {},
  tinaDirectory: 'tina',
});

export default database;
