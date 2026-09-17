import { GitForge, type GitRepository } from "$lib/gql/graphql";

export type GitRepoLike = Pick<GitRepository, "owner" | "name"> & Partial<Pick<GitRepository, "forge" | "host" | "url" | "commitUrlTemplate">>;

export function getRepositoryName(repo?: GitRepoLike | null): string | null {
  if (repo?.owner && repo?.name) {
    return `${repo.owner}/${repo.name}`;
  }
  return null;
}

export function getRepositoryUrl(repo?: GitRepoLike | null): string | null {
  return repo?.url ?? null;
}

export function getCommitUrl(repo?: GitRepoLike | null, sha?: string | null): string | null {
  const trimmedSha = sha?.trim();
  if (!trimmedSha || !/^[0-9a-f]{7,40}$/i.test(trimmedSha)) return null;

  if (repo?.commitUrlTemplate) {
    return repo.commitUrlTemplate.replace("{sha}", trimmedSha);
  }

  if (repo?.url) {
    return `${repo.url}/commit/${trimmedSha}`;
  }

  return null;
}

export function getForgeLabel(repo?: GitRepoLike | null): string {
  switch (repo?.forge) {
    case GitForge.Github:
    default:
      return "GitHub";
  }
}
