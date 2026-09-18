import { GitForge, type GitRepository } from "$lib/gql/graphql";

export type GitRepoLike = Pick<GitRepository, "url"> & Partial<Pick<GitRepository, "forge" | "host" | "owner" | "name" | "fullName">>;

export function getRepositoryName(repo?: GitRepoLike | null): string | null {
  if (repo?.fullName) {
    return repo.fullName;
  }
  if (repo?.owner && repo?.name) {
    return `${repo.owner}/${repo.name}`;
  }
  return null;
}

export function getRepositoryUrl(repo?: GitRepoLike | null): string | null {
  return repo?.url ?? null;
}

export function getForgeLabel(repo?: GitRepoLike | null): string {
  switch (repo?.forge) {
    case GitForge.Github:
    default:
      return "GitHub";
  }
}
