<template>
	<p style="font-size: 16px;">{{ message }}</p>
	<p style="font-size: 16px;">Partial prop value: {{ value ? value : 'Not loaded' }}</p>
	<p style="font-size: 16px;">Partial prop asyncValue: {{ asyncValue ? asyncValue : 'Not loaded' }}</p>

	<Link href="/inertia/new-hello" :only="['value', 'asyncValue']">
		Load partial data
	</Link>
	<Link href="/inertia/dto-validator" method="post">
		Test validator
	</Link>

	<div v-if="errors">
		<div v-for="(error, key) in errors">
			<p>{{key}} -> {{error}}</p>
		</div>
	</div>

</template>

<script lang="js">


import {Link} from '@inertiajs/inertia-vue3';

export default {
	name  : "HelloPageTwo",
	props : ['message', 'value', 'asyncValue', 'errors'],
	components : {
		Link
	}
};
</script>

<style scoped>

</style>
