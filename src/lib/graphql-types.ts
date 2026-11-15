import type { BuildChannel } from "#lib/gql/graphql.ts";

export type Java = {
  version: { minimum: number };
  flags: { recommended: string[] };
};

export type Commit = {
  sha: string;
  message: string;
};

export type Build = {
  number: number;
  channel: BuildChannel;
  createdAt: string;
  commits: Commit[];
  downloads: {
    name: string;
    size: number;
    url: string;
    checksums: { sha256: string };
  }[];
};
