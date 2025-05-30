import React from "react";
import Layout from "@/components/layout/layout";
import ClientPage from "./[...urlSegments]/client-page";
import { dbConnection } from "@/lib/databaseConnection";

export const revalidate = 300;

export default async function Home() {
  const data = await dbConnection.queries.page({
    relativePath: `home.mdx`,
  });

  return (
    <Layout rawPageData={data}>
      <ClientPage {...data} />
    </Layout>
  );
}
