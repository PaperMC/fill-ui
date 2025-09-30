import type { Readable } from "svelte/store";
import { onMount } from "svelte";
import type { OperationResultState } from "@urql/svelte";

export const API_ENDPOINT = import.meta.env.DEV ? "http://localhost:8080" : "https://fill.papermc.io";

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
