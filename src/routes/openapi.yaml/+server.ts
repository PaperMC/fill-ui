import type { RequestHandler } from "./$types";
import { error } from "@sveltejs/kit";
import { API_ENDPOINT } from "$lib/api.svelte";

// The upstream spec is served without CORS headers, so the docs page reads it through this same-origin proxy.
export const GET: RequestHandler = async ({ fetch }) => {
  const upstream = await fetch(API_ENDPOINT + "/openapi.yaml");
  if (!upstream.ok) {
    error(502, "Could not load the API specification");
  }
  return new Response(upstream.body, {
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/yaml",
      "cache-control": "public, max-age=300",
    },
  });
};
