import { GitForge, type GitRepository } from "$lib/gql/graphql";

const GITHUB_ORG = "PaperMC";

const PROJECT_REPO_MAP: Record<string, string> = {
  paper: "Paper",
  folia: "Folia",
  velocity: "Velocity",
  waterfall: "Waterfall",
  travertine: "Travertine",
};

export type GitRepoLike = Pick<GitRepository, "owner" | "name"> & Partial<Pick<GitRepository, "forge" | "host" | "url" | "commitUrlTemplate">>;

export function getRepositoryName(repo?: GitRepoLike | null, projectKey?: string | null): string | null {
  if (repo?.owner && repo?.name) {
    return `${repo.owner}/${repo.name}`;
  }
  const trimmed = projectKey?.trim();
  if (!trimmed || !/^[a-zA-Z0-9._-]+$/.test(trimmed)) return null;
  const normalized = trimmed.toLowerCase();
  const repoName = PROJECT_REPO_MAP[normalized] ?? trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return `${GITHUB_ORG}/${repoName}`;
}

export function getRepositoryUrl(repo?: GitRepoLike | null, projectKey?: string | null): string | null {
  if (repo?.url) {
    return repo.url;
  }
  const repoName = getRepositoryName(repo, projectKey);
  return repoName ? `https://github.com/${repoName}` : null;
}

export function getCommitUrl(repo?: GitRepoLike | null, projectKey?: string | null, sha?: string | null): string | null {
  const trimmedSha = sha?.trim();
  if (!trimmedSha || !/^[0-9a-f]{7,40}$/i.test(trimmedSha)) return null;

  if (repo?.commitUrlTemplate) {
    return repo.commitUrlTemplate.replace("{sha}", trimmedSha);
  }

  const repoUrl = getRepositoryUrl(repo, projectKey);
  if (!repoUrl) return null;

  return `${repoUrl}/commit/${trimmedSha}`;
}

export function getForgeLabel(repo?: GitRepoLike | null): string {
  switch (repo?.forge) {
    case GitForge.Github:
    default:
      return "GitHub";
  }
}

export const getProjectGitHubRepo = (projectKey?: string | null) => getRepositoryName(null, projectKey);
export const getProjectGitHubUrl = (projectKey?: string | null) => getRepositoryUrl(null, projectKey);
export const getCommitGitHubUrl = (projectKey?: string | null, sha?: string | null) => getCommitUrl(null, projectKey, sha);
