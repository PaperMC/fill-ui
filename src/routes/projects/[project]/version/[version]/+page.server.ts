import type { PageServerLoad } from "./$types";
import { graphql } from "#lib/gql/index.ts";
import { createServerClient } from "#lib/api.svelte.ts";
import { shouldSSROpenGraph } from "#lib/utils.ts";

export const load: PageServerLoad = async ({ request, params }) => {
  if (shouldSSROpenGraph(request)) {
    const query = graphql(`
      query SSRVersion($project: String!, $id: String!) {
        project(key: $project) {
          key
          name
          version(key: $id) {
            key
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
