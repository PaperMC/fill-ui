<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { AUTH_CTX } from "$lib/auth.svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { type HeaderProps } from "$lib/components/custom/header/index.svelte";
  import { CircleUserIcon, LogOutIcon, WebhookIcon } from "@lucide/svelte";

  let { breadcrumbs }: HeaderProps = $props();
  const auth = AUTH_CTX.get();

  let loginRedirect = $derived(page.url.pathname + page.url.search);
</script>

<div>
  <div class="flex justify-between">
    <h1 class="text-3xl">
      <a
        class="rounded-sm text-inherit no-underline transition-colors hover:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        href={resolve("/")}>Fill</a
      >
    </h1>
    {#if auth.getUsername()}
      <div class="flex items-center gap-2">
        {#if page.url.pathname !== resolve("/webhooks")}
          <Button variant="outline" size="sm" href={resolve("/webhooks")}>
            <WebhookIcon data-icon="inline-start" />
            Webhooks
          </Button>
        {/if}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon-sm" })} aria-label="Open profile menu">
            <CircleUserIcon />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" class="w-56">
            <DropdownMenu.Label>{auth.getUsername()}</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              variant="destructive"
              onclick={() => {
                auth.logout();
                goto(resolve(`/login?redirect=${encodeURIComponent(loginRedirect)}`));
              }}
            >
              <LogOutIcon data-icon="inline-start" />
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    {:else}
      <Button variant="outline" size="sm" href="/login?redirect={encodeURIComponent(loginRedirect)}">Login</Button>
    {/if}
  </div>
  <Breadcrumb.Root>
    <Breadcrumb.List class="text-lg">
      {#each breadcrumbs as seg, i (`${seg.href}-${i}`)}
        <Breadcrumb.Item>
          <Breadcrumb.Link class="flex items-center text-foreground hover:text-muted-foreground" href={seg.href}>
            {seg.label}
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        {#if i < breadcrumbs.length - 1}
          <Breadcrumb.Separator class="iconify font-light select-none lucide--slash" />
        {/if}
      {/each}
    </Breadcrumb.List>
  </Breadcrumb.Root>
</div>
