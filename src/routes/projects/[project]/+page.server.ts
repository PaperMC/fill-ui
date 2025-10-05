import type { PageServerLoad } from "./$types";
import { graphql } from "$lib/gql";
import { createServerClient } from "$lib/api.svelte";
import { shouldSSROpenGraph } from "$lib/utils";

export const load: PageServerLoad = async ({ request, params }) => {
  if (shouldSSROpenGraph(request)) {
    const query = graphql(`
      query SSRProject($project: String!) {
        project(id: $project) {
          id
          name
        }
      }
    `);
    const result = await createServerClient()
      .query(query, {
        project: params.project,
      })
      .toPromise();
    if (result.data) {
      return {
        preloadedProject: result.data,
      };
    }
  }
  return {};
};
