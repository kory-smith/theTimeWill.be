<script lang="ts">
	import { page } from '$app/state';
</script>

<p>{page?.error?.message}</p>
<p>That's not a valid URL! Try <a href="/12/minutes/after/2:35/pm">12 minutes after 2:35 pm</a></p>
