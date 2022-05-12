angular
    .module('airlst')
    .config([
        '$locationProvider',
        'Env',
        '$translateProvider',
        config
    ]);

import enTranslations from './i18n/en/translations.js'
import deTranslations from './i18n/de/translations.js'

function config($locationProvider, Env, $translateProvider) {
    $locationProvider.html5Mode({
        enabled: Env.html5,
        requireBase: false
    });

    $translateProvider
        .translations('en', enTranslations)
        .translations('de', deTranslations)
        .preferredLanguage('de')
        .fallbackLanguage('en')
        .useSanitizeValueStrategy('escape');
}

require('./vendor/quill-config');
