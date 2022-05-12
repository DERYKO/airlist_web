angular
    .module('airlst.auth')
    .config([
        '$authProvider',
        'Env',
        config
    ]);

function config($authProvider, Env) {
    $authProvider.baseUrl = Env.apiUrl;
    $authProvider.signupUrl = 'auth/register';
}
