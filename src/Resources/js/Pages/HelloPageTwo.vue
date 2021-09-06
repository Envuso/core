<template>
	<p style="font-size: 16px;">{{ message }}</p>
	<p style="font-size: 16px;">Partial prop value: {{ value ? value : 'Not loaded' }}</p>
	<p style="font-size: 16px;">Partial prop asyncValue: {{ asyncValue ? asyncValue : 'Not loaded' }}</p>

	<Link href="/inertia/new-hello" :only="['value', 'asyncValue']">
		Load partial data
	</Link>
</template>

<script lang="js">


import {Link} from '@inertiajs/inertia-vue3';

export default {
	name  : "HelloPageTwo",
	props : ['message', 'value', 'asyncValue'],
	components : {
		Link
	}
};
</script>

<style scoped>

</style>
