import oiSelect from 'oi.select';
import rollbar from 'ng-rollbar';
import MODULE_NAME from '../app.js';
import ngSanitize from 'angular-sanitize';
import ngInputModified from 'angular-input-modified';
import restangular from 'restangular';
import ngFileUpload from 'ng-file-upload';
import ngLocker from 'angular-locker';
import ngMoment from 'angular-moment';
import satellizer from 'satellizer';
import ngFileSaver from 'angular-file-saver';

// import dependencies without var declaration
import 'angular-papaparse';
import 'angular-sweetalert';
import 'angular-xeditable';
import 'angular-ui-ace';
import 'angular-filters';
import '../vendor/angular-localization.js';
import 'angular-growl-v2';
import 'tinycolor2';
import 'angularjs-color-picker';
import 'angular-moment-picker';
import 'angular-ui-switch';
import 'v-accordion';
// import 'angular-animate';


/**
 * @ngdoc object
 * @name components
 * @description
 *
 */
angular.module(MODULE_NAME + '.components', [
    'ng',
    'ui.router',
    oiSelect,
    rollbar,
    ngSanitize,
    ngFileSaver,
    ngInputModified,
    restangular,
    'oitozero.ngSweetAlert',
    ngFileUpload,
    ngLocker,
    'xeditable',
    'ui.ace',
    'frapontillo.ex.filters',
    ngMoment,
    satellizer,
    'ngLocalize',
    'ngLocalize.InstalledLanguages',
    'angular-growl',
    'color.picker',
    'moment-picker',
    'uiSwitch',
    'vAccordion',
    // 'ngAnimate',
    'airlst.components.stats'
]);

require('./constants/env.js');

angular.module(MODULE_NAME + '.components')
    .config([
        '$compileProvider',
        function ($compileProvider) {
            // configure new 'compile' directive by passing a directive
            // factory function. The factory function injects the '$compile'
            $compileProvider.directive('compile', [
                '$compile',
                function ($compile) {
                    // directive factory creates a link function
                    return function (scope, element, attrs) {
                        scope.$watch(
                            function (scope) {
                                // watch the 'compile' expression for changes
                                return scope.$eval(attrs.compile);
                            },
                            function (value) {
                                // when the 'compile' expression changes
                                // assign it into the current DOM
                                element.html(value);

                                // compile the new DOM and link it to the current
                                // scope.
                                // NOTE: we only compile .childNodes so that
                                // we don't get into infinite loop compiling ourselves
                                $compile(element.contents())(scope);
                            }
                        );
                    };
                }
            ]);
        }
    ])
    .config([
        'RollbarProvider',
        'Env',
        function (RollbarProvider, Env) {
            if (Env.rollbarEnv !== 'local') {
                RollbarProvider.init({
                    accessToken: Env.rollbarKey,
                    captureUncaught: true,
                    reportLevel: Env.rollbarLvl,
                    logLevel: Env.rollbarLvl,
                    payload: {
                        environment: Env.rollbarEnv
                    }
                });
            }
        }
    ])
    .directive('convertToNumber', [
        function () {
            return {
                require: 'ngModel',
                link: [
                    'scope',
                    'element',
                    'attrs',
                    'ngModel',
                    function (scope, element, attrs, ngModel) {
                        ngModel.$parsers.push(function (val) {
                            return '' + val;
                        });
                        ngModel.$formatters.push(function (val) {
                            return parseInt(val);
                        });
                    }
                ]
            };
        }
    ])
    .run([
        'Restangular',
        '$rootScope',
        'editableOptions',
        'editableThemes',
        '$http',
        run
    ]);

require('./components-restangular');
require('./components-growl');

function run(Restangular, $rootScope, editableOptions, editableThemes, $http, $trace) {

    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    editableThemes.bs3.buttonsClass = 'btn-simple btn-xs';
    editableThemes.bs3.inputClass = 'input-sm';

    $rootScope.deposit = {
        countries: []
    };

    $http.get('/deposits/countries.json').then(function (response) {
        var countries = response.data;

        function compare(a, b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        }

        countries.sort(compare);

        countries.unshift({"name": "-- choose country --", "dial_code": "", "code": ""});
        $rootScope.deposit.countries = countries;
    });


    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        console.log(arguments);
    });

    Restangular.addResponseInterceptor(transformIncludes);
    Restangular.addResponseInterceptor(transformMeta);

    function transformMeta(data, operation, what, url, response, deferred) {
        var transformed = data;
        if (!_.isUndefined(data.data)) {
            transformed = data.data;
            if (!_.isUndefined(data.meta)) {
                transformed.meta = data.meta
            }
        }
        return transformed;
    }

    function transformIncludes(data, operation, what, url, response, deferred) {
        var transformed, includes, params;
        deferred.promise.then(function () {
            if (!_.isUndefined(data.data) && !_.isUndefined(data.data.reqParams)) {
                params = data.data.reqParams;
                if (params !== null && 'include' in params) {
                    includes = params.include.split(',');
                    if (_.isArray(data.data)) {
                        transformCollection(data, includes);
                    }
                    else {
                        transformRecord(data.data, includes);
                    }
                }
            }
        });
        transformed = data;
        return transformed;
    }

    function transformCollection(data, includes) {
        _.each(data.data, function (record) {
            transformRecord(record, includes);
            _.forEach(includes, function (include) {
                if (record[include]) {
                    record[include].data.fromServer = true;
                }
            });
        });
    }

    function transformRecord(record, includes) {
        _.each(includes, function (include) {
            var route = include;
            if (record[include] && 'data' in record[include]) {
                if (record[include]['data'].length > 0) {
                    Restangular.restangularizeCollection(record, record[include].data, route);
                }
                else {
                    if (include === 'contact')
                        route = 'contacts';
                    Restangular.restangularizeElement(record, record[include].data, route);
                }

                record[include].data.fromServer = true;
            }
        });
    }
}

// Components
require('./components/selectize/component');
require('./components/al-wizard/component');
require('./components/al-switch/component');
require('./components/airport-payback-actions/component');
require('./components/selected-items/selected-items');
require('./components/contact-preview/contact-preview');
require('./components/contact-picklists/contact-picklists');
require('./components/rsvp-guests/rsvp-guests');
require('./components/message-preview/message-preview');
require('./components/scroll-toolset/scroll-toolset');
require('./components/importer/importer');
require('./components/contact-bookings/contact-bookings');
require('./components/rsvp-messages-small/rsvp-messages');

// Directives
require('./directives/country-name/country-name-directive');
require('./directives/custom-view/custom-view-directive');
require('./directives/customfield/customfield-directive');
require('./directives/date-time/date-time-directive');
require('./directives/editor/editor-directive');
require('./directives/ng-enter/ng-enter-directive');
require('./directives/select-box/select-box-directive');
require('./state-manager/listview/listview');
require('./state-manager/duplicates-listview/listview');

// Factories
require('./factories/controller/controller-factory');
require('./factories/filter-preset-factory');
require('./factories/resource-factory');
require('./factories/statistics-factory');
require('./factories/workflows-factory');

// Filters
require('./filters/random');
require('./filters/range');
require('./filters/nl2br');
require('./filters/typeof');
require('./filters/objLength');

// Services
require('./services/acl/acl-service');
require('./services/alerts/alert-service');
require('./services/deposit/deposit-service');
require('./services/Error/error-service');
require('./services/history/state-decorator');
require('./services/pusher/pusher-factory');
require('./services/resourcecommon/resource-common-service');
require('./services/resourceselect/resource-select-service');
require('./services/selectbox/select-box-service');
require('./services/ace/ace-service');

// Values
require('./values/locale-fallbacks-value');
require('./values/locale-supported-value');

require('./navigation/navigation-components');

require('./stats/stats-module');
require('./intercepts')
;
require('./workflows');
