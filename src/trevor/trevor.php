<?php

namespace rasteiner\trevor;

use Kirby\Cms\Language;

class Trevor {
    static function languages() {
        return kirby()->languages()->toArray(function(Language $lang) {
            $arr = $lang->toArray();
            $arr['translations'] = $lang->translations();

            return $arr;
        });
    }

    static function patch(array $langs) {
        foreach ($langs as $code => $data) {
            $lang = kirby()->language($code);
            $state = $lang->translations();
            foreach ($data as $key => $translation) {
                $state[$key] = $translation;
            }
            $lang->update(['translations' => $state]);
        }
        return true;
    }
}
