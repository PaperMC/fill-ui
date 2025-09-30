<script lang="ts">
  import * as Alert from "$lib/components/ui/alert";
  import CircleAlertIcon from "@lucide/svelte/icons/circle-alert";

  let { ...restProps } = $props();
</script>

<Alert.Root {...restProps}>
  <CircleAlertIcon />
  <Alert.Title>Java Configuration Overrides</Alert.Title>
  <Alert.Description>
    Setting a value for any override will cause the entire Java configuration to be saved, overriding all family values. Conversely, leaving all overrides empty
    will submit an empty Java configuration (fall back to family values on query). This means (for example) if you want to override the minimum Java version but
    keep the family's recommended flags, you must use the button to copy the family flags into the override field.
  </Alert.Description>
</Alert.Root>
