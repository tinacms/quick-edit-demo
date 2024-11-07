import { MongodbLevel } from "mongodb-level";
import { createDatabase } from "@tinacms/datalayer";
import { MockGitHubProvider } from "./mock-git-provider";

const mongodbLevelStore = new MongodbLevel<string, Record<string, any>>({
  collectionName: "tinacms",
  dbName: "tinacms",
  mongoUri: process.env.MONGODB_URI as string,
});

const database = createDatabase({
  databaseAdapter: mongodbLevelStore,
  gitProvider: new MockGitHubProvider({ owner: "tinacms", repo: "tinacms", token: "token", branch: "main" }),
});

export default database;