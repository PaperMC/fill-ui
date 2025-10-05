import type { LayoutServerLoad } from "./$types";
import { shouldSSROpenGraph } from "$lib/utils";

export const load: LayoutServerLoad = async ({ request }) => {
  return {
    shouldSSROpenGraph: shouldSSROpenGraph(request),
  };
};
