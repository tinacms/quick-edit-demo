import React from "react";
import client from "../../tina/__generated__/databaseClient";
import ClientPage from "./client-page";
import Layout from "../../components/layout/layout";

export default async function Page({
  params,
}: {
  params: { filename: string[] };
}) {
  const { filename } = await params;
  const data = await client.queries.page({
    relativePath: `${filename}.md`,
  });

  return (
    <Layout rawPageData={data}>
      <ClientPage {...data}></ClientPage>
    </Layout>
  );
}

export async function generateStaticParams() {
  const pages = await client.queries.pageConnection();
  const paths = pages.data?.pageConnection.edges.map((edge) => ({
    filename: edge.node._sys.breadcrumbs,
  }));

  return paths || [];
}
