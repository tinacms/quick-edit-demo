import { MongodbLevel } from "mongodb-level";
import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { MockGitHubProvider } from "./mock-git-provider";

// Log to help troubleshoot connection issues
console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);

const mongodbLevelStore = new MongodbLevel<string, Record<string, any>>({
  collectionName: "tinacms",
  dbName: "tinacms",
  mongoUri: process.env.MONGODB_URI as string,
});

// Add error handling for MongoDB connection
mongodbLevelStore.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const database = isLocal ? createLocalDatabase() : createDatabase({
  databaseAdapter: mongodbLevelStore,
  gitProvider: new MockGitHubProvider({ owner: "tinacms", repo: "tinacms", token: "token", branch: "main" }),
});

export default database;