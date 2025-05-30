import database from "../tina/database";
import { queries } from "../tina/__generated__/types";
import { resolve } from "@tinacms/datalayer";
import type { TinaClient } from "tinacms/dist/client";
import { parse } from "graphql";

// Helper function to convert objects with null prototype to plain objects
function toPlainObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(toPlainObject);
  }
  
  const plainObj: Record<string, any> = {};
  for (const key in obj) {
    plainObj[key] = toPlainObject(obj[key]);
  }
  
  return plainObj;
}

export async function databaseRequest({ query, variables }) {
  try {
    const queryNode = parse(query);
    if (queryNode.definitions[0].kind === "OperationDefinition") {
      if (queryNode.definitions[0].operation === "mutation") {
        // Don't support mutations since this path is unauthenticated
        return {
          data: {},
        };
      }
    }

    console.log("Resolving query with variables:", JSON.stringify(variables || {}).substring(0, 100));
    
    const result = await resolve({
      config: {
        useRelativeMedia: true,
      },
      database,
      query,
      variables,
      verbose: true,
    });
    
    // Ensure we have a valid result
    if (!result) {
      console.error("Null or undefined result from resolve");
      throw new Error("Invalid database response");
    }
    
    // Convert the result to plain objects
    const plainResult = toPlainObject(result);
    console.log("Result structure:", Object.keys(plainResult || {}).join(", "));
    
    return plainResult;
  } catch (error) {
    console.error("Error in databaseRequest:", error);
    throw error;
  }
}

export function getDatabaseConnection<GenQueries = Record<string, unknown>>({
  queries,
}: {
  queries: (client: {
    request: TinaClient<GenQueries>["request"];
  }) => GenQueries;
}) {
  const request = async ({ query, variables }) => {
    try {
      const data = await databaseRequest({ query, variables });
      return { data: data.data as any, query, variables, errors: data.errors };
    } catch (error) {
      console.error("Error in database connection request:", error);
      throw error;
    }
  };
  const q = queries({
    request,
  });
  return { queries: q, request };
}

export const dbConnection = getDatabaseConnection({ queries });
