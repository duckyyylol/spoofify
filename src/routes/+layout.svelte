<script lang="ts">
    import { browser } from '$app/environment';
    import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
    import { getTheme, getUserData, Header, UserRoles, Website } from 'duckylib';

	let { children } = $props();

	let theme = $state(getTheme());

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if page.url.pathname.includes("overlays")}
	<!-- <Website options={{theme: theme}}> -->
	<div class="dark" style="background-color: transparent; color: var(--text);">
		{@render children()}
	</div>
	<!-- </Website> -->
{:else}

<Website options={{theme: theme}}>
<Header 
	emoji="💜"
	label="🎷 🎶 🎺"

	authFeatures={true}
	onlogin={async () => {
		if(browser) window.location.replace(`/auth?from=${page.url.pathname}`)
	}}
	onlogout={async () => {
		if(browser) window.location.replace(`/auth/logout`)
	}}

	defaultNav={false}

	nav={getUserData()?.role === UserRoles.ADMIN ? [
		{
			label: "Queue",
			symbol: "queue_music",
			pathname: "/"
		},
		{
			label: "Manage",
			symbol: "shield_person",
			pathname: "/manage"
		}
	] : [{
			label: "Queue",
			symbol: "queue_music",
			pathname: "/"
		}]}
 />
	{@render children()}
</Website>
{/if}


<!-- <style>
	div {
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;

		background-color: var(--base);

		width: 100vw;
		height: 100vh;
		z-index: 10;
	}
</style> -->
