import { GitForge } from "$lib/gql/graphql";

export function getForgeLabel(forge?: GitForge | null): string {
  switch (forge) {
    case GitForge.Github:
    default:
      return "GitHub";
  }
}
