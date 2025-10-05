import type { Readable } from "svelte/store";
import { onMount } from "svelte";
import { getContextClient, type OperationResultState, queryStore } from "@urql/svelte";
import { graphql } from "$lib/gql";
import { Context } from "runed";

const PROD_ENDPOINT = "https://fill.papermc.io";
export const API_ENDPOINT = getApiEndpoint();

function getApiEndpoint() {
  if (import.meta.env.DEV) {
    if (import.meta.env.VITE_USE_PROD_ENDPOINT === "true") {
      return PROD_ENDPOINT;
    }
    return "http://localhost:8080";
  }
  return PROD_ENDPOINT;
}

export class RunedQuery<V> {
  private currentState: OperationResultState<V> | undefined = $state();

  constructor(store: Readable<OperationResultState<V>>) {
    onMount(() => {
      return store.subscribe(
        (value) => {
          this.currentState = value;
        },
        () => {
          this.currentState = undefined;
        },
      );
    });
  }

  get loading() {
    return this.currentState === undefined || this.currentState.fetching;
  }

  get current() {
    return this.currentState?.data;
  }

  get error() {
    return this.currentState?.error;
  }
}

export const SHARED_QUERIES_CTX = new Context<SharedQueries>("fill-shared-queries");

export class SharedQueries {
  projects = new RunedQuery(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query AllProjects {
          projects {
            id
            name
          }
        }
      `),
    }),
  );

  projectNameOrFallback(projectId?: string) {
    if (!projectId) return undefined;
    return this.projects.current?.projects?.find((p) => p !== null && p.id === projectId)?.name || projectId;
  }
}
