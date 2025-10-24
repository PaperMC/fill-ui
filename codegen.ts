import { type CodegenConfig } from "@graphql-codegen/cli";

const PROD_ENDPOINT = "https://fill.papermc.io/graphql";

function getSchema() {
  if (process.env.USE_PROD_ENDPOINT === "true") {
    return PROD_ENDPOINT;
  }
  return "http://localhost:8080/graphql";
}

const config: CodegenConfig = {
  schema: getSchema(),
  documents: ["src/**/*.svelte", "src/**/*.ts", "src/**/*.svelte.ts"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/lib/gql/": {
      preset: "client",
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
