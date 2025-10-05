import type { PageServerLoad } from "./$types";
import { graphql } from "$lib/gql";
import { createServerClient } from "$lib/api.svelte";
import { shouldSSROpenGraph } from "$lib/utils";

export const load: PageServerLoad = async ({ request, params }) => {
  if (shouldSSROpenGraph(request)) {
    const query = graphql(`
      query SSRFamily($project: String!, $id: String!) {
        project(id: $project) {
          id
          name
          family(id: $id) {
            id
          }
        }
      }
    `);
    const result = await createServerClient()
      .query(query, {
        project: params.project,
        id: params.family,
      })
      .toPromise();
    if (result.data) {
      return {
        preloadedFamily: result.data,
      };
    }
  }
  return {};
};
