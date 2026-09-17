const GITHUB_ORG = "PaperMC";

const PROJECT_REPO_MAP: Record<string, string> = {
  paper: "Paper",
  folia: "Folia",
  velocity: "Velocity",
  waterfall: "Waterfall",
  travertine: "Travertine",
};

export function getProjectGitHubRepo(projectKey?: string | null): string | null {
  const trimmed = projectKey?.trim();
  if (!trimmed || !/^[a-zA-Z0-9._-]+$/.test(trimmed)) return null;
  const normalized = trimmed.toLowerCase();
  const repoName = PROJECT_REPO_MAP[normalized] ?? trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return `${GITHUB_ORG}/${repoName}`;
}

export function getProjectGitHubUrl(projectKey?: string | null): string | null {
  const repo = getProjectGitHubRepo(projectKey);
  return repo ? `https://github.com/${repo}` : null;
}

export function getCommitGitHubUrl(projectKey?: string | null, sha?: string | null): string | null {
  const trimmedSha = sha?.trim();
  if (!trimmedSha || !/^[0-9a-f]{7,40}$/i.test(trimmedSha)) return null;
  const repoUrl = getProjectGitHubUrl(projectKey);
  return repoUrl ? `${repoUrl}/commit/${trimmedSha}` : null;
}
