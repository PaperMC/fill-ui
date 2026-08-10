import { createContext, hydratable } from "svelte";

export type Hydrate = <T>(key: string, fn: () => T) => T;

type Scope = {
  readonly path: string;
  nextChildPath(): string;
};

const [getScope, setScope] = createContext<Scope>();

function createScope(path: string): Scope {
  let nextChild = 0;

  return {
    path,

    nextChildPath() {
      return `${path}/c/${nextChild++}`;
    },
  };
}

function createHydrate(scope: Scope): Hydrate {
  return <T>(key: string, fn: () => T): T => {
    return hydratable(`${scope.path}/v/${encodeURIComponent(key)}`, fn);
  };
}

export function createRootHydrationScope(namespace: string): Hydrate {
  const scope = createScope(`hydration-scope/${encodeURIComponent(namespace)}`);

  setScope(scope);

  return createHydrate(scope);
}

export function createAppHydrationScope(): Hydrate {
  return createRootHydrationScope("app");
}

export function createHydrationScope(): Hydrate {
  const parent = getScope();
  const scope = createScope(parent.nextChildPath());

  setScope(scope);

  return createHydrate(scope);
}
