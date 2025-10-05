import type { Readable } from "svelte/store";
import { onMount } from "svelte";
import type { OperationResultState } from "@urql/svelte";

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
