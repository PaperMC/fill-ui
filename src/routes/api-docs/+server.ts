import { ScalarApiReference } from "@scalar/sveltekit";
import type { RequestHandler } from "./$types";
import { API_ENDPOINT } from "#lib/api-endpoint.ts";

export const GET: RequestHandler = ScalarApiReference({
  pageTitle: "API docs - Fill",
  url: API_ENDPOINT + "/openapi.yaml",
});
