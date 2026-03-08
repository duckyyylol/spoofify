<script lang="ts">
    import { browser } from '$app/environment';
    import { page } from '$app/state';
    import { redirect } from '@sveltejs/kit';
    import { setUserData } from 'duckylib';
    import { onMount } from 'svelte';

    let {data} = $props();

    function getUser() {
        return data.user;
    }

    onMount(() => {
    let fromPath = page.url.searchParams.get("from") || "/";

        if(getUser() !== null) {
            setUserData(getUser());
            setTimeout(() => {
                if(browser) window.location.replace(fromPath)
            }, 1e3)
        } else {
            if(browser) window.localStorage.removeItem("userData")
            setTimeout(() => {
                if(browser) window.location.replace("/")
            }, 1e3)
        }
    })
</script>