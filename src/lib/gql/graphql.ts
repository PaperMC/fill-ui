/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An RFC-3339 compliant Full Date Scalar */
  Date: { input: any; output: any; }
  /** A slightly refined version of RFC-3339 compliant DateTime Scalar */
  DateTime: { input: any; output: any; }
};

export type Build = Node & {
  __typename?: 'Build';
  channel: BuildChannel;
  commits: Array<Commit>;
  createdAt: Scalars['DateTime']['output'];
  download?: Maybe<Download>;
  downloads: Array<Download>;
  id: Scalars['ID']['output'];
  number: Scalars['Int']['output'];
};


export type BuildDownloadArgs = {
  key: Scalars['String']['input'];
};

export enum BuildChannel {
  Alpha = 'ALPHA',
  Beta = 'BETA',
  Recommended = 'RECOMMENDED',
  Stable = 'STABLE'
}

export type BuildConnection = {
  __typename?: 'BuildConnection';
  edges?: Maybe<Array<Maybe<BuildEdge>>>;
  nodes?: Maybe<Array<Maybe<Build>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BuildEdge = {
  __typename?: 'BuildEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Build>;
};

export type BuildFilters = {
  channels?: InputMaybe<Array<InputMaybe<BuildChannel>>>;
};

export type BuildOrder = {
  direction?: InputMaybe<OrderDirection>;
};

export type Checksums = {
  __typename?: 'Checksums';
  sha256: Scalars['String']['output'];
};

export type Commit = {
  __typename?: 'Commit';
  message: Scalars['String']['output'];
  sha: Scalars['String']['output'];
};

export type CreateFamilyInput = {
  java: JavaInput;
  key: Scalars['String']['input'];
  project: Scalars['String']['input'];
};

export type CreateFamilyPayload = {
  __typename?: 'CreateFamilyPayload';
  family?: Maybe<Family>;
};

export type CreateVersionInput = {
  family: Scalars['String']['input'];
  java?: InputMaybe<JavaInput>;
  key: Scalars['String']['input'];
  project: Scalars['String']['input'];
};

export type CreateVersionPayload = {
  __typename?: 'CreateVersionPayload';
  version?: Maybe<Version>;
};

export type DeleteFamilyInput = {
  key: Scalars['String']['input'];
  project: Scalars['String']['input'];
};

export type DeleteFamilyPayload = {
  __typename?: 'DeleteFamilyPayload';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteVersionInput = {
  key: Scalars['String']['input'];
  project: Scalars['String']['input'];
};

export type DeleteVersionPayload = {
  __typename?: 'DeleteVersionPayload';
  ok: Scalars['Boolean']['output'];
};

export type Download = {
  __typename?: 'Download';
  checksums: Checksums;
  name: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type Family = Node & {
  __typename?: 'Family';
  id: Scalars['ID']['output'];
  java: Java;
  key: Scalars['String']['output'];
};

export type Java = {
  __typename?: 'Java';
  flags: JavaFlags;
  version: JavaVersion;
};

export type JavaFlags = {
  __typename?: 'JavaFlags';
  recommended: Array<Scalars['String']['output']>;
};

export type JavaFlagsInput = {
  recommended: Array<Scalars['String']['input']>;
};

export type JavaInput = {
  flags: JavaFlagsInput;
  version: JavaVersionInput;
};

export type JavaVersion = {
  __typename?: 'JavaVersion';
  minimum: Scalars['Int']['output'];
};

export type JavaVersionInput = {
  minimum: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createFamily?: Maybe<CreateFamilyPayload>;
  createVersion?: Maybe<CreateVersionPayload>;
  deleteFamily?: Maybe<DeleteFamilyPayload>;
  deleteVersion?: Maybe<DeleteVersionPayload>;
  promoteBuild?: Maybe<PromoteBuildPayload>;
  updateFamily?: Maybe<UpdateFamilyPayload>;
  updateVersion?: Maybe<UpdateVersionPayload>;
};


export type MutationCreateFamilyArgs = {
  input: CreateFamilyInput;
};


export type MutationCreateVersionArgs = {
  input: CreateVersionInput;
};


export type MutationDeleteFamilyArgs = {
  input: DeleteFamilyInput;
};


export type MutationDeleteVersionArgs = {
  input: DeleteVersionInput;
};


export type MutationPromoteBuildArgs = {
  input: PromoteBuildInput;
};


export type MutationUpdateFamilyArgs = {
  input: UpdateFamilyInput;
};


export type MutationUpdateVersionArgs = {
  input: UpdateVersionInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Project = Node & {
  __typename?: 'Project';
  families?: Maybe<Array<Maybe<Family>>>;
  family?: Maybe<Family>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  version?: Maybe<Version>;
  versions?: Maybe<VersionConnection>;
};


export type ProjectFamilyArgs = {
  key: Scalars['String']['input'];
};


export type ProjectVersionArgs = {
  key: Scalars['String']['input'];
};


export type ProjectVersionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filterBy?: InputMaybe<VersionFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VersionOrder>;
};

export type PromoteBuildInput = {
  number: Scalars['Int']['input'];
  project: Scalars['String']['input'];
  version: Scalars['String']['input'];
};

export type PromoteBuildPayload = {
  __typename?: 'PromoteBuildPayload';
  build: Build;
  version: Version;
};

export type Query = {
  __typename?: 'Query';
  project?: Maybe<Project>;
  projects?: Maybe<Array<Maybe<Project>>>;
};


export type QueryProjectArgs = {
  key: Scalars['String']['input'];
};

export type Support = {
  __typename?: 'Support';
  end?: Maybe<Scalars['Date']['output']>;
  status: SupportStatus;
};

export type SupportInput = {
  end?: InputMaybe<Scalars['Date']['input']>;
  status: SupportStatus;
};

export enum SupportStatus {
  Deprecated = 'DEPRECATED',
  Supported = 'SUPPORTED',
  Unsupported = 'UNSUPPORTED'
}

export type UpdateFamilyInput = {
  java?: InputMaybe<JavaInput>;
  key: Scalars['String']['input'];
  project: Scalars['String']['input'];
};

export type UpdateFamilyPayload = {
  __typename?: 'UpdateFamilyPayload';
  family?: Maybe<Family>;
};

export type UpdateVersionInput = {
  java?: InputMaybe<JavaInput>;
  key: Scalars['String']['input'];
  project: Scalars['String']['input'];
  support?: InputMaybe<SupportInput>;
};

export type UpdateVersionPayload = {
  __typename?: 'UpdateVersionPayload';
  version?: Maybe<Version>;
};

export type Version = Node & {
  __typename?: 'Version';
  builds?: Maybe<BuildConnection>;
  family: Family;
  id: Scalars['ID']['output'];
  java?: Maybe<Java>;
  key: Scalars['String']['output'];
  support: Support;
};


export type VersionBuildsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filterBy?: InputMaybe<BuildFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BuildOrder>;
};

export type VersionConnection = {
  __typename?: 'VersionConnection';
  edges?: Maybe<Array<Maybe<VersionEdge>>>;
  nodes?: Maybe<Array<Maybe<Version>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type VersionEdge = {
  __typename?: 'VersionEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Version>;
};

export type VersionFilters = {
  familyKey?: InputMaybe<Scalars['String']['input']>;
  supportStatus?: InputMaybe<SupportStatus>;
};

export type VersionOrder = {
  direction?: InputMaybe<OrderDirection>;
};

export type AllProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllProjectsQuery = { __typename?: 'Query', projects?: Array<{ __typename?: 'Project', id: string, key: string, name: string } | null> | null };

export type PromoteBuildMutationVariables = Exact<{
  input: PromoteBuildInput;
}>;


export type PromoteBuildMutation = { __typename?: 'Mutation', promoteBuild?: { __typename?: 'PromoteBuildPayload', version: { __typename?: 'Version', id: string }, build: { __typename?: 'Build', id: string, channel: BuildChannel } } | null };

export type SsrProjectQueryVariables = Exact<{
  project: Scalars['String']['input'];
}>;


export type SsrProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', key: string, name: string } | null };

export type ProjectFamiliesQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ProjectFamiliesQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, families?: Array<{ __typename?: 'Family', id: string, key: string } | null> | null } | null };

export type SsrFamilyQueryVariables = Exact<{
  project: Scalars['String']['input'];
  id: Scalars['String']['input'];
}>;


export type SsrFamilyQuery = { __typename?: 'Query', project?: { __typename?: 'Project', key: string, name: string, family?: { __typename?: 'Family', key: string } | null } | null };

export type FamilyQueryVariables = Exact<{
  project: Scalars['String']['input'];
  id: Scalars['String']['input'];
}>;


export type FamilyQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, family?: { __typename?: 'Family', id: string, key: string, java: { __typename?: 'Java', version: { __typename?: 'JavaVersion', minimum: number }, flags: { __typename?: 'JavaFlags', recommended: Array<string> } } } | null, versions?: { __typename?: 'VersionConnection', edges?: Array<{ __typename?: 'VersionEdge', node?: { __typename?: 'Version', id: string, key: string, family: { __typename?: 'Family', id: string, key: string }, support: { __typename?: 'Support', status: SupportStatus, end?: any | null } } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } | null } | null };

export type CreateFamilyMutationVariables = Exact<{
  input: CreateFamilyInput;
}>;


export type CreateFamilyMutation = { __typename?: 'Mutation', createFamily?: { __typename?: 'CreateFamilyPayload', family?: { __typename?: 'Family', id: string, key: string, java: { __typename?: 'Java', version: { __typename?: 'JavaVersion', minimum: number }, flags: { __typename?: 'JavaFlags', recommended: Array<string> } } } | null } | null };

export type SsrVersionQueryVariables = Exact<{
  project: Scalars['String']['input'];
  id: Scalars['String']['input'];
}>;


export type SsrVersionQuery = { __typename?: 'Query', project?: { __typename?: 'Project', key: string, name: string, version?: { __typename?: 'Version', key: string, support: { __typename?: 'Support', status: SupportStatus, end?: any | null } } | null } | null };

export type VersionQueryVariables = Exact<{
  projectKey: Scalars['String']['input'];
  versionKey: Scalars['String']['input'];
}>;


export type VersionQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, version?: { __typename?: 'Version', id: string, key: string, support: { __typename?: 'Support', status: SupportStatus, end?: any | null }, java?: { __typename?: 'Java', version: { __typename?: 'JavaVersion', minimum: number }, flags: { __typename?: 'JavaFlags', recommended: Array<string> } } | null, family: { __typename?: 'Family', id: string, key: string, java: { __typename?: 'Java', version: { __typename?: 'JavaVersion', minimum: number }, flags: { __typename?: 'JavaFlags', recommended: Array<string> } } } } | null } | null };

export type VersionBuildsQueryVariables = Exact<{
  projectKey: Scalars['String']['input'];
  versionKey: Scalars['String']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type VersionBuildsQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, version?: { __typename?: 'Version', id: string, builds?: { __typename?: 'BuildConnection', edges?: Array<{ __typename?: 'BuildEdge', node?: { __typename?: 'Build', id: string, number: number, channel: BuildChannel, createdAt: any, downloads: Array<{ __typename?: 'Download', name: string, size: number, url: string, checksums: { __typename?: 'Checksums', sha256: string } }>, commits: Array<{ __typename?: 'Commit', sha: string, message: string }> } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } | null } | null } | null };

export type UpdateVersionMutationVariables = Exact<{
  input: UpdateVersionInput;
}>;


export type UpdateVersionMutation = { __typename?: 'Mutation', updateVersion?: { __typename?: 'UpdateVersionPayload', version?: { __typename?: 'Version', id: string, key: string, support: { __typename?: 'Support', status: SupportStatus, end?: any | null }, java?: { __typename?: 'Java', version: { __typename?: 'JavaVersion', minimum: number }, flags: { __typename?: 'JavaFlags', recommended: Array<string> } } | null } | null } | null };

export type ProjectFamiliesWithMetaQueryVariables = Exact<{
  projectKey: Scalars['String']['input'];
}>;


export type ProjectFamiliesWithMetaQuery = { __typename?: 'Query', project?: { __typename?: 'Project', families?: Array<{ __typename?: 'Family', id: string, key: string, java: { __typename?: 'Java', version: { __typename?: 'JavaVersion', minimum: number }, flags: { __typename?: 'JavaFlags', recommended: Array<string> } } } | null> | null } | null };

export type CreateVersionMutationVariables = Exact<{
  input: CreateVersionInput;
}>;


export type CreateVersionMutation = { __typename?: 'Mutation', createVersion?: { __typename?: 'CreateVersionPayload', version?: { __typename?: 'Version', key: string, family: { __typename?: 'Family', key: string }, java?: { __typename?: 'Java', version: { __typename?: 'JavaVersion', minimum: number }, flags: { __typename?: 'JavaFlags', recommended: Array<string> } } | null } | null } | null };


export const AllProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllProjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AllProjectsQuery, AllProjectsQueryVariables>;
export const PromoteBuildDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PromoteBuild"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PromoteBuildInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promoteBuild"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"build"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"}}]}}]}}]}}]} as unknown as DocumentNode<PromoteBuildMutation, PromoteBuildMutationVariables>;
export const SsrProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SSRProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"project"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"project"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SsrProjectQuery, SsrProjectQueryVariables>;
export const ProjectFamiliesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectFamilies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"families"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectFamiliesQuery, ProjectFamiliesQueryVariables>;
export const SsrFamilyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SSRFamily"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"project"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"project"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"family"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]} as unknown as DocumentNode<SsrFamilyQuery, SsrFamilyQueryVariables>;
export const FamilyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Family"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"project"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"project"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"family"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"java"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"Field","name":{"kind":"Name","value":"flags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommended"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filterBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"familyKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"family"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"support"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FamilyQuery, FamilyQueryVariables>;
export const CreateFamilyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFamily"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFamilyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFamily"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"java"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"Field","name":{"kind":"Name","value":"flags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommended"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateFamilyMutation, CreateFamilyMutationVariables>;
export const SsrVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SSRVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"project"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"project"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"version"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"support"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SsrVersionQuery, SsrVersionQueryVariables>;
export const VersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Version"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"versionKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"versionKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"support"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"java"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"Field","name":{"kind":"Name","value":"flags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommended"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"family"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"java"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"Field","name":{"kind":"Name","value":"flags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommended"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<VersionQuery, VersionQueryVariables>;
export const VersionBuildsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VersionBuilds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"versionKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"versionKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"builds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"25"}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"_relayPagination"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"channel"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"downloads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"checksums"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sha256"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"commits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sha"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<VersionBuildsQuery, VersionBuildsQueryVariables>;
export const UpdateVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVersionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"support"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"java"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"Field","name":{"kind":"Name","value":"flags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommended"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateVersionMutation, UpdateVersionMutationVariables>;
export const ProjectFamiliesWithMetaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectFamiliesWithMeta"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"families"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"java"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"Field","name":{"kind":"Name","value":"flags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommended"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProjectFamiliesWithMetaQuery, ProjectFamiliesWithMetaQueryVariables>;
export const CreateVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVersionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"family"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"java"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"Field","name":{"kind":"Name","value":"flags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recommended"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateVersionMutation, CreateVersionMutationVariables>;