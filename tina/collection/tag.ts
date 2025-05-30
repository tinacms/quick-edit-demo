import type { Collection } from "tinacms";
import DemoMode from "../fields/demo-mode";

const Tag: Collection = {
  label: "Tags",
  name: "tag",
  path: "content/tags",
  format: "mdx",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
      createNestedFolder: false,
    },
  },
  fields: [
    {
      type: "string",
      label: "Name",
      name: "name",
      isTitle: true,
      required: true,
    },
    {
      type: 'boolean',
      label: 'Demo Mode',
      name: 'demoMode',
      ui: {
        component: DemoMode,
      }
    },
  ],
};

export default Tag;
