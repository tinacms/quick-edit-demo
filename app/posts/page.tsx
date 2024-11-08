import Layout from "../../components/layout/layout";
import databaseClient from "../../tina/__generated__/databaseClient";
import PostsClientPage from "./client-page";

export default async function PostsPage() {
  const posts = await databaseClient.queries.postConnection();

  if (!posts) {
    return null;
  }

  return (
    <Layout rawPageData={posts.data}>
      <PostsClientPage {...posts} />
    </Layout>
  );
}
