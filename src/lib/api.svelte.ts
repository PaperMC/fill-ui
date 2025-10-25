import type { Readable } from "svelte/store";
import { createClient, fetchExchange, getContextClient, type OperationResultState, queryStore } from "@urql/svelte";
import { graphql } from "$lib/gql";
import { Context, watch } from "runed";

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
  private currentData: V | undefined = $state();
  private unsub: () => void = () => {};

  static static<V>(store: Readable<OperationResultState<V>>) {
    return new RunedQuery(() => store);
  }

  constructor(store: () => Readable<OperationResultState<V>>) {
    watch(
      () => store(),
      (s) => {
        this.unsub();
        this.unsub = s.subscribe(
          (value) => {
            this.currentState = value;
            if (value.data) {
              this.currentData = value.data;
            }
          },
          () => {
            this.currentState = undefined;
            this.currentData = undefined;
          },
        );
        return () => {
          this.unsub();
        };
      },
    );
  }

  get loading() {
    return this.currentState === undefined || this.currentState.fetching;
  }

  get current() {
    return this.currentData;
  }

  get error() {
    return this.currentState?.error;
  }
}

export const SHARED_QUERIES_CTX = new Context<SharedQueries>("fill-shared-queries");

export class SharedQueries {
  projects = RunedQuery.static(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query AllProjects {
          projects {
            id
            key
            name
          }
        }
      `),
    }),
  );

  projectNameOrFallback(projectId?: string) {
    if (!projectId) return undefined;
    return this.projects.current?.projects?.find((p) => p !== null && p.key === projectId)?.name || projectId;
  }
}

export function createServerClient() {
  return createClient({
    url: API_ENDPOINT + "/graphql",
    exchanges: [fetchExchange],
    preferGetMethod: false,
  });
}
