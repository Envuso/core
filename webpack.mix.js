const mix = require('laravel-mix');

mix.js('src/Resources/js/app.js', 'assets/app.js');
mix.vue({version : 3});
mix.setPublicPath('assets');
mix.disableNotifications();
