import type { LayoutServerLoad } from "./$types";
import { shouldSSROpenGraph } from "#lib/utils.ts";

export const load: LayoutServerLoad = async ({ request }) => {
  return {
    shouldSSROpenGraph: shouldSSROpenGraph(request),
  };
};
