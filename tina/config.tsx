import { defineConfig } from "tinacms";
import { MockAuthProvider } from "./mock-auth-provider";
import Page from "./collection/page";
import Post from "./collection/post";
import Author from "./collection/author";
import Tag from "./collection/tag";
import Global from "./collection/global";

const LOCAL_KEY = "tinacns-fake-auth";

const config = defineConfig({
  contentApiUrlOverride: "/api/gql",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH! || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! || // Vercel branch env
    process.env.HEAD!, // Netlify branch env
  token: process.env.TINA_TOKEN!,
  authProvider: new MockAuthProvider(),
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
      static: true,
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema: {
    collections: [Page, Post, Author, Tag, Global],
  },
});

export default config;
