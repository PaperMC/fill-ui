<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { getLocalTimeZone, type CalendarDate } from "@internationalized/date";

  let { value = $bindable(), noValueText = "Select a date" }: { value?: CalendarDate; noValueText?: string } = $props();

  const id = $props.id();

  let open = $state(false);
</script>

<Popover.Root bind:open>
  <Popover.Trigger id="{id}-date">
    {#snippet child({ props })}
      <Button {...props} variant="outline" class="w-48 justify-between font-normal">
        {#if value}
          <span>{value.toDate(getLocalTimeZone()).toLocaleDateString()}</span>
        {:else}
          <span class="text-neutral-500">{noValueText}</span>
        {/if}
        <ChevronDownIcon />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto overflow-hidden p-0" align="start">
    <Calendar
      type="single"
      bind:value
      captionLayout="dropdown"
      onValueChange={() => {
        open = false;
      }}
    />
  </Popover.Content>
</Popover.Root>
