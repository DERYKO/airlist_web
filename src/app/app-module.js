import MODULE_NAME from './app';

import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import uiBootstrap from 'angular-ui-bootstrap';
import LoadingBar from 'angular-loading-bar';
import ngFilter from 'angular-filter';
import ngChartJS from 'angular-chart.js';
import uiTree from 'angular-ui-tree';
import ngQrcode from 'angular-qrcode';

import 'angular-clipboard';
import 'angular-translate';
import 'ng-quill';
import 'angular-ui-sortable';

import 'pusher-angular';

import './components/components-module';
import './pages/pages-module';
import './theme/base/base-module';
import './theme/airlst/airlst-module';
import './modules/module';

angular.module(MODULE_NAME, [
    uiRouter,
    uiBootstrap,
    uiTree,
    ngFilter,
    ngChartJS,
    LoadingBar,
    ngQrcode,
    'pusher-angular',
    `${MODULE_NAME}.components`,
    `${MODULE_NAME}.pages`,
    `${MODULE_NAME}.theme.base`,
    `${MODULE_NAME}.theme.airlst`,
    `${MODULE_NAME}.modules`,
    'angular-clipboard',
    'pascalprecht.translate',
    'ngQuill',
    'ui.sortable'
]);

require('./app-module-run.js');
require('./app-module-config.js');
require('./app-csv-reader.js');
require('./app-config.js');

angular.element(function () {
    angular.bootstrap(document, [MODULE_NAME]);
});
