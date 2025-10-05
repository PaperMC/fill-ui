import type { PageServerLoad } from "./$types";
import { graphql } from "$lib/gql";
import { createServerClient } from "$lib/api.svelte";
import { shouldSSROpenGraph } from "$lib/utils";

export const load: PageServerLoad = async ({ request, params }) => {
  if (shouldSSROpenGraph(request)) {
    const query = graphql(`
      query SSRVersion($project: String!, $id: String!) {
        project(id: $project) {
          id
          name
          version(id: $id) {
            id
            support {
              status
              end
            }
          }
        }
      }
    `);
    const result = await createServerClient()
      .query(query, {
        project: params.project,
        id: params.version,
      })
      .toPromise();
    if (result.data) {
      return {
        preloadedVersion: result.data,
      };
    }
  }
  return {};
};
