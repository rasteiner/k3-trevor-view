<?php
use rasteiner\trevor\Trevor;

return [
    [
        'pattern' => 'trevor/languages',
        'method' => 'GET',
        'action' => function() {
            return Trevor::languages();
        }
    ],
    [
        'pattern' => 'trevor/languages/translations',
        'method' => 'PATCH',
        'action' => function () {
            return Trevor::patch($this->requestBody());
        }
    ],


];
