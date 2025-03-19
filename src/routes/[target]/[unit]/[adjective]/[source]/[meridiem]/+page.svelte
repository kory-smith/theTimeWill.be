<script lang="ts">
	let { data } = $props();

	let copied = $state(false);

	function handleCopy() {
		copied = true;
		setTimeout(() => (copied = false), 1000);
	}
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
	<meta name="description" content={data.metadata.description}/>
</svelte:head>

<div class="my-8">
	<h1 class="text-3xl">{data.source}</h1>
	<h2 class="text-massive inline">
		<time class="text-blue-500">{data.solution}</time>
		<button
			onclick={() => {
				if (navigator.clipboard) {
					navigator.clipboard.writeText(data.solution);
					handleCopy();
				}
			}}
		>
			{#if copied}
				<p class="text-5xl mx-auto my-auto">Copied!</p>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-14 h-14 inline mx-auto my-auto"
				>
					<path
						fill-rule="evenodd"
						d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5V7A2.5 2.5 0 0011 4.5H8.128a2.252 2.252 0 011.884-1.488A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z"
						clip-rule="evenodd"
					/>
					<path
						fill-rule="evenodd"
						d="M2 7a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm2 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</button>
		{data.offset ? ` ${data.offset}` : null}
	</h2>
</div>
