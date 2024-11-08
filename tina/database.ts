import { MongodbLevel } from "mongodb-level";
import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { MockGitHubProvider } from "./mock-git-provider";

const mongodbLevelStore = new MongodbLevel<string, Record<string, any>>({
  collectionName: "tinacms",
  dbName: "tinacms",
  mongoUri: process.env.MONGODB_URI as string,
});

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const database = isLocal ? createLocalDatabase() : createDatabase({
  databaseAdapter: mongodbLevelStore,
  gitProvider: new MockGitHubProvider({ owner: "tinacms", repo: "tinacms", token: "token", branch: "main" }),
});

export default database;