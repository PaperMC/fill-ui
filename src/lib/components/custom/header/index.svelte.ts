import type { SharedQueries } from "$lib/api.svelte";

export interface HeaderNavigationSegment {
  label: string;
  href: string;
}

export interface HeaderProps {
  breadcrumbs: HeaderNavigationSegment[];
}

export const projectsHeaderSegment: HeaderNavigationSegment = {
  label: "Projects",
  href: "/projects",
};

export function buildHeaderSegments(queries: SharedQueries, projectId?: string, familyId?: string, versionId?: string): HeaderNavigationSegment[] {
  const segments: HeaderNavigationSegment[] = [projectsHeaderSegment];
  // Only push subsequent segments if the parent segment exists
  if (projectId) {
    segments.push(projectHeaderSegment(projectId, queries.projectNameOrFallback(projectId) ?? projectId));
    if (familyId) {
      segments.push(familyHeaderSegment(projectId, familyId));
      if (versionId) {
        segments.push(versionHeaderSegment(projectId, versionId));
      }
    }
  }
  return segments;
}

export function projectHeaderSegment(projectId: string, projectName: string): HeaderNavigationSegment {
  return {
    label: projectName,
    href: `/projects/${encodeURIComponent(projectId)}`,
  };
}

export function familyHeaderSegment(projectId: string, familyId: string): HeaderNavigationSegment {
  return {
    label: familyId,
    href: `/projects/${encodeURIComponent(projectId)}/family/${encodeURIComponent(familyId)}`,
  };
}

export function versionHeaderSegment(projectId: string, versionId: string): HeaderNavigationSegment {
  return {
    label: versionId,
    href: `/projects/${encodeURIComponent(projectId)}/version/${encodeURIComponent(versionId)}`,
  };
}
