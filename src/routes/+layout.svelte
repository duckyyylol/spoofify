<script lang="ts">
    import { browser } from '$app/environment';
    import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.png';
    import { getTheme, Header, UserRoles, Website, type Auth } from 'duckylib';
    import { onMount } from 'svelte';

	let { children } = $props();

	let theme = $state(getTheme());

	let user: Auth.User | null = $state(null);

	onMount(() => {
		// console.log(window.localStorage.getItem("userData"))
		if(browser) user = JSON.parse(["null", "undefined"].includes(window.localStorage.getItem("userData") || "null") ? "{}" : window.localStorage.getItem("userData") as string) as Auth.User | undefined || null;
	})

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Spoofify{page.url.pathname.includes("overlays") ? " | Overlay" : ""}</title>
</svelte:head>

{#if page.url.pathname.startsWith("/overlays")}
	<!-- <Website options={{theme: theme}}> -->
	<div class="dark" style="background-color: transparent; color: var(--text); margin: 0; padding: 0; box-sizing: border-box;">
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

	defaultNav={true}

	nav={(user && (user !== undefined || user !== null) && (user?.role === UserRoles.ADMIN && user?.role !== undefined)) ? [
		{
			label: "Queue",
			symbol: "queue_music",
			pathname: "/"
		},
		{
			label: "Dashboard",
			symbol: "settings",
			pathname: "/dashboard"
		},
		{
			label: "Commands",
			symbol: "code_blocks",
			pathname: "/commands"
		},
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
