import {createApp, h}     from 'vue';
import {createInertiaApp} from '@inertiajs/inertia-vue3';

document.addEventListener("DOMContentLoaded", () => {

	const appEl = document.getElementById('app');

	createInertiaApp({
		provide : 'app',
		page    : JSON.parse(appEl.dataset.page),
		resolve : name => {
			return require(`./Pages/${name}.vue`);
		},
		setup({el, App, props, plugin})
		{
			console.log('props', props);
			createApp({render : () => h(App, props)})
				.use(plugin)
				.mount(el);
		},
	});
});
