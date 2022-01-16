<template>
	<div>
		<p>User data:</p>
		<p>{{ this.userData }}</p>
	</div>
</template>

<script lang="js">
export default {
	name     : "ApiResource",
	props    : ['user'],
	computed : {
		userData()
		{
			return JSON.stringify(this.user);
		},
	},
};
</script>

<style scoped>

</style>
