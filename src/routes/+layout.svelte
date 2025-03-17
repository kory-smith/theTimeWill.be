<script lang="ts">
	import '../app.css';
	let { children, data } = $props();
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
	<meta name="description" content={data.metadata.description} />
</svelte:head>

{@render children()}

<footer class="text-center text-gray-500 text-sm mt-8">
	<p>
		A
		<a href="example.com" target="_blank" rel="noopener noreferrer"> Spook Software </a>
		website
	</p>
</footer>
