<?php

load([
    'rasteiner\\trevor\\trevor' => 'trevor/trevor.php'
], __DIR__ . '/src');

Kirby::plugin('rasteiner/k3-trevor-view', [
    'translations' => require __DIR__ . '/config/translations.php',
    'api' => [
        'routes' => require __DIR__ . '/config/api.php'
    ]
]);
