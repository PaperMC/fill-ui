/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n        mutation PromoteBuild($input: PromoteBuildInput!) {\n          promoteBuild(input: $input) {\n            version {\n              id\n            }\n          }\n        }\n      ": typeof types.PromoteBuildDocument,
    "\n        query AllProjects {\n          projects {\n            id\n          }\n        }\n      ": typeof types.AllProjectsDocument,
    "\n        query ProjectFamilies($id: String!) {\n          project(id: $id) {\n            families {\n              id\n            }\n          }\n        }\n      ": typeof types.ProjectFamiliesDocument,
    "\n        query Family($project: String!, $id: String!) {\n          project(id: $project) {\n            family(id: $id) {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n            versions(filterBy: { familyId: $id }) {\n              id\n              family {\n                id\n              }\n              support {\n                status\n                end\n              }\n            }\n          }\n        }\n      ": typeof types.FamilyDocument,
    "\n        mutation CreateFamily($input: CreateFamilyInput!) {\n          createFamily(input: $input) {\n            family {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      ": typeof types.CreateFamilyDocument,
    "\n        query Version($project: String!, $id: String!) {\n          project(id: $project) {\n            version(id: $id) {\n              id\n              support {\n                status\n                end\n              }\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n              family {\n                id\n                java {\n                  version {\n                    minimum\n                  }\n                  flags {\n                    recommended\n                  }\n                }\n              }\n            }\n          }\n        }\n      ": typeof types.VersionDocument,
    "\n        query VersionBuilds($project: String!, $id: String!) {\n          project(id: $project) {\n            version(id: $id) {\n              builds {\n                id\n                time\n                channel\n                downloads {\n                  name\n                  size\n                  url\n                  checksums {\n                    sha256\n                  }\n                }\n                commits {\n                  sha\n                  message\n                }\n              }\n            }\n          }\n        }\n      ": typeof types.VersionBuildsDocument,
    "\n        mutation UpdateVersion($input: UpdateVersionInput!) {\n          updateVersion(input: $input) {\n            version {\n              id\n            }\n          }\n        }\n      ": typeof types.UpdateVersionDocument,
    "\n        query ProjectFamiliesWithMeta($id: String!) {\n          project(id: $id) {\n            families {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      ": typeof types.ProjectFamiliesWithMetaDocument,
    "\n        mutation CreateVersion($input: CreateVersionInput!) {\n          createVersion(input: $input) {\n            version {\n              id\n              family {\n                id\n              }\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      ": typeof types.CreateVersionDocument,
};
const documents: Documents = {
    "\n        mutation PromoteBuild($input: PromoteBuildInput!) {\n          promoteBuild(input: $input) {\n            version {\n              id\n            }\n          }\n        }\n      ": types.PromoteBuildDocument,
    "\n        query AllProjects {\n          projects {\n            id\n          }\n        }\n      ": types.AllProjectsDocument,
    "\n        query ProjectFamilies($id: String!) {\n          project(id: $id) {\n            families {\n              id\n            }\n          }\n        }\n      ": types.ProjectFamiliesDocument,
    "\n        query Family($project: String!, $id: String!) {\n          project(id: $project) {\n            family(id: $id) {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n            versions(filterBy: { familyId: $id }) {\n              id\n              family {\n                id\n              }\n              support {\n                status\n                end\n              }\n            }\n          }\n        }\n      ": types.FamilyDocument,
    "\n        mutation CreateFamily($input: CreateFamilyInput!) {\n          createFamily(input: $input) {\n            family {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      ": types.CreateFamilyDocument,
    "\n        query Version($project: String!, $id: String!) {\n          project(id: $project) {\n            version(id: $id) {\n              id\n              support {\n                status\n                end\n              }\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n              family {\n                id\n                java {\n                  version {\n                    minimum\n                  }\n                  flags {\n                    recommended\n                  }\n                }\n              }\n            }\n          }\n        }\n      ": types.VersionDocument,
    "\n        query VersionBuilds($project: String!, $id: String!) {\n          project(id: $project) {\n            version(id: $id) {\n              builds {\n                id\n                time\n                channel\n                downloads {\n                  name\n                  size\n                  url\n                  checksums {\n                    sha256\n                  }\n                }\n                commits {\n                  sha\n                  message\n                }\n              }\n            }\n          }\n        }\n      ": types.VersionBuildsDocument,
    "\n        mutation UpdateVersion($input: UpdateVersionInput!) {\n          updateVersion(input: $input) {\n            version {\n              id\n            }\n          }\n        }\n      ": types.UpdateVersionDocument,
    "\n        query ProjectFamiliesWithMeta($id: String!) {\n          project(id: $id) {\n            families {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      ": types.ProjectFamiliesWithMetaDocument,
    "\n        mutation CreateVersion($input: CreateVersionInput!) {\n          createVersion(input: $input) {\n            version {\n              id\n              family {\n                id\n              }\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      ": types.CreateVersionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation PromoteBuild($input: PromoteBuildInput!) {\n          promoteBuild(input: $input) {\n            version {\n              id\n            }\n          }\n        }\n      "): (typeof documents)["\n        mutation PromoteBuild($input: PromoteBuildInput!) {\n          promoteBuild(input: $input) {\n            version {\n              id\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query AllProjects {\n          projects {\n            id\n          }\n        }\n      "): (typeof documents)["\n        query AllProjects {\n          projects {\n            id\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query ProjectFamilies($id: String!) {\n          project(id: $id) {\n            families {\n              id\n            }\n          }\n        }\n      "): (typeof documents)["\n        query ProjectFamilies($id: String!) {\n          project(id: $id) {\n            families {\n              id\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query Family($project: String!, $id: String!) {\n          project(id: $project) {\n            family(id: $id) {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n            versions(filterBy: { familyId: $id }) {\n              id\n              family {\n                id\n              }\n              support {\n                status\n                end\n              }\n            }\n          }\n        }\n      "): (typeof documents)["\n        query Family($project: String!, $id: String!) {\n          project(id: $project) {\n            family(id: $id) {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n            versions(filterBy: { familyId: $id }) {\n              id\n              family {\n                id\n              }\n              support {\n                status\n                end\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation CreateFamily($input: CreateFamilyInput!) {\n          createFamily(input: $input) {\n            family {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      "): (typeof documents)["\n        mutation CreateFamily($input: CreateFamilyInput!) {\n          createFamily(input: $input) {\n            family {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query Version($project: String!, $id: String!) {\n          project(id: $project) {\n            version(id: $id) {\n              id\n              support {\n                status\n                end\n              }\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n              family {\n                id\n                java {\n                  version {\n                    minimum\n                  }\n                  flags {\n                    recommended\n                  }\n                }\n              }\n            }\n          }\n        }\n      "): (typeof documents)["\n        query Version($project: String!, $id: String!) {\n          project(id: $project) {\n            version(id: $id) {\n              id\n              support {\n                status\n                end\n              }\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n              family {\n                id\n                java {\n                  version {\n                    minimum\n                  }\n                  flags {\n                    recommended\n                  }\n                }\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query VersionBuilds($project: String!, $id: String!) {\n          project(id: $project) {\n            version(id: $id) {\n              builds {\n                id\n                time\n                channel\n                downloads {\n                  name\n                  size\n                  url\n                  checksums {\n                    sha256\n                  }\n                }\n                commits {\n                  sha\n                  message\n                }\n              }\n            }\n          }\n        }\n      "): (typeof documents)["\n        query VersionBuilds($project: String!, $id: String!) {\n          project(id: $project) {\n            version(id: $id) {\n              builds {\n                id\n                time\n                channel\n                downloads {\n                  name\n                  size\n                  url\n                  checksums {\n                    sha256\n                  }\n                }\n                commits {\n                  sha\n                  message\n                }\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation UpdateVersion($input: UpdateVersionInput!) {\n          updateVersion(input: $input) {\n            version {\n              id\n            }\n          }\n        }\n      "): (typeof documents)["\n        mutation UpdateVersion($input: UpdateVersionInput!) {\n          updateVersion(input: $input) {\n            version {\n              id\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query ProjectFamiliesWithMeta($id: String!) {\n          project(id: $id) {\n            families {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      "): (typeof documents)["\n        query ProjectFamiliesWithMeta($id: String!) {\n          project(id: $id) {\n            families {\n              id\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation CreateVersion($input: CreateVersionInput!) {\n          createVersion(input: $input) {\n            version {\n              id\n              family {\n                id\n              }\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      "): (typeof documents)["\n        mutation CreateVersion($input: CreateVersionInput!) {\n          createVersion(input: $input) {\n            version {\n              id\n              family {\n                id\n              }\n              java {\n                version {\n                  minimum\n                }\n                flags {\n                  recommended\n                }\n              }\n            }\n          }\n        }\n      "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;