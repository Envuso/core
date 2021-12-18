<template>
	<p>{{ message }}</p>

	<Link href="/inertia/new-hello">
		Goto another page
	</Link>
</template>

<script lang="js">


import {Link} from '@inertiajs/inertia-vue3';

export default {
	name  : "Hello",
	props : ['message'],
	components : {
		Link
	}
};
</script>

<style scoped>

</style>
