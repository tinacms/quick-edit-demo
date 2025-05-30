import type { Collection } from "tinacms";
import ImagePickerInput from "../fields/image";
import DemoMode from "../fields/demo-mode";

const Author: Collection = {
  label: "Authors",
  name: "author",
  path: "content/authors",
  format: "md",
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
      type: "image",
      label: "Avatar",
      name: "avatar",
      // @ts-ignore
      uploadDir: () => "authors",
      ui: {
        component: ImagePickerInput,
      }
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
export default Author;
