<script>
  import { page } from '$app/stores';
</script>

{#if $page.status === 400 && $page.error?.message === 'Invalid URL params'}
  <p>
    The params are wrong. Please input valid params. An example of a valid
    URL is https://theTimeWill.be/12/minutes/after/1:20/pm
  </p>
{:else if $page.error?.input}
  <p>
    {$page.error.message}. Please provide a valid time. You provided {$page.error.input}
  </p>
{:else}
  <p>An unexpected error occurred: {$page.error?.message || 'Unknown error'}</p>
{/if}