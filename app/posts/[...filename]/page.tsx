import React from "react";
import databaseClient from "../../../tina/__generated__/databaseClient";
import Layout from "../../../components/layout/layout";
import PostClientPage from "./client-page";

export default async function PostPage({
  params,
}: {
  params: { filename: string[] };
}) {
  const { filename } = await params;
  const data = await databaseClient.queries.post({
    relativePath: `${filename.join("/")}.mdx`,
  });

  return (
    <Layout rawPageData={data}>
      <PostClientPage {...data} />
    </Layout>
  );
}

export async function generateStaticParams() {
  const posts = await databaseClient.queries.postConnection();
  const paths = posts.data?.postConnection.edges.map((edge) => ({
    filename: edge.node._sys.breadcrumbs,
  }));
  return paths || [];
}
