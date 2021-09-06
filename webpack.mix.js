const mix = require('laravel-mix');

mix.js('src/Resources/js/app.js', 'public/app.js');
mix.vue({version : 3});
mix.setPublicPath('public');
