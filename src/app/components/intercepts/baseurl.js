angular
    .module('airlst.components')
    .config([
        '$httpProvider',
        interceptor
    ]);


function interceptor($httpProvider) {
    $httpProvider.interceptors.push([
        'Env',
        (Env) => {
            return {
                request(config) {
                    if (config.url.indexOf('http') < 0 && config.url.indexOf('.js') < 0&& config.url.indexOf('.html') < 0) {
                        config.url = Env.apiUrl + '/' + config.url
                    }
                    return config;
                }
            };
        }
    ]);

}