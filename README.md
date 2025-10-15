# fill-ui

Web UI for [Fill](https://github.com/PaperMC/fill).

## Prerequisites

- [Bun](https://bun.sh/) (latest version recommended)

## Getting Started

Install dependencies:

```sh
bun install
```

## Development

Start the development server:

```sh
# Using local API
bun run dev

# Using production API
bun run devProdServer
```

## Building

Create a production build:

```sh
bun run build
```

Preview the production build:

```sh
bun run preview
```

## Code Quality

Check types:

```sh
bun run check
```

Lint:

```sh
bun run lint
```

Format code:

```sh
bun run format
```

## GraphQL Code Generation

Generate GraphQL types and client code:

```sh
# Using production endpoint
bun run codegen

# Using development endpoint
bun run codegenDev
```

## Deployment

This project is configured to deploy to Cloudflare Workers using the `@sveltejs/adapter-cloudflare` adapter. See `wrangler.jsonc` for Cloudflare Workers configuration.
