<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb";
  import { Button } from "$lib/components/ui/button";
  import { AUTH_CTX } from "$lib/auth.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  interface Props {
    project?: string | undefined;
    projectPage?: { name: string; href: string } | undefined;
    family?: string | undefined;
    version?: string | undefined;
  }
  type Segment = { label: string; href: string };
  let { project, projectPage, family, version }: Props = $props();
  const auth = AUTH_CTX.get();
  const encode = (v: string) => encodeURIComponent(v);
  const segments: Segment[] = $derived.by(() => {
    const seg: Segment[] = [];
    seg.push({ label: "Projects", href: "/projects" });
    if (project) seg.push({ label: project, href: `/projects/${encode(project)}` });
    if (project && projectPage) {
      seg.push({ label: projectPage.name, href: projectPage.href });
    }
    if (project && family) seg.push({ label: family, href: `/projects/${encode(project)}/family/${encode(family)}` });
    if (project && family && version) seg.push({ label: version, href: `/projects/${encode(project)}/version/${encode(version)}` });
    return seg;
  });
  let loginRedirect = $derived(page.url.pathname + page.url.search);
</script>

<div>
  <div class="flex justify-between">
    <h1 class="text-3xl">Fill</h1>
    {#if auth.getUsername()}
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1"><span class="iconify lucide--circle-user"></span> {auth.getUsername()}</div>
        <Button
          variant="destructive"
          size="sm"
          onclick={() => {
            auth.logout();
            // eslint-disable-next-line svelte/no-navigation-without-resolve
            goto("/login?redirect=" + loginRedirect);
          }}>Logout</Button
        >
      </div>
    {:else}
      <Button variant="link" href="/login?redirect={loginRedirect}">Login</Button>
    {/if}
  </div>
  <Breadcrumb.Root>
    <Breadcrumb.List class="text-lg">
      {#each segments as seg, i (seg.href)}
        <Breadcrumb.Item>
          <Breadcrumb.Link class="flex items-center text-foreground hover:text-muted-foreground" href={seg.href}>
            {seg.label}
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        {#if i < segments.length - 1}
          <Breadcrumb.Separator class="iconify font-light select-none lucide--slash" />
        {/if}
      {/each}
    </Breadcrumb.List>
  </Breadcrumb.Root>
</div>
