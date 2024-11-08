import { Post } from "../../components/posts/post";
import { dbConnection } from "../../lib/databaseConnection";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";
import client from "../../tina/__generated__/databaseClient";

// Use the props returned by get static props
export default function BlogPostPage(
  props
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  if (data && data.post) {
    return (
      <Layout rawData={data} data={data.global}>
        <Post {...data.post} />
      </Layout>
    );
  }
  return (
    <Layout>
      <div>No data</div>;
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  // const tinaProps = await client.queries.post({relativePath: `${params.filename}.mdx`});
  // console.log(tinaProps);
  const tinaProps = await client.queries.post({
    relativePath: `${params.filename}.mdx`,
  });

  return {
    props: {
        data: tinaProps.data,
        query: tinaProps.query,
        variables: tinaProps.variables,
      }
  };
};

/**
 * To build the blog post pages we just iterate through the list of
 * posts and provide their "filename" as part of the URL path
 *
 * So a blog post at "content/posts/hello.md" would
 * be viewable at http://localhost:3000/posts/hello
 */
export const getStaticPaths = async () => {
  const postsListData = await dbConnection.queries.postConnection();
  return {
    paths: postsListData.data.postConnection.edges.map((post) => ({
      params: { filename: post.node._sys.filename },
    })),
    fallback: "blocking",
  };
};