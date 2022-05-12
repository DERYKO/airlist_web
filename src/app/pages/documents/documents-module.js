import './main/main-module';
import './templates/templates-module';

/**
 * @ngdoc object
 * @name documents
 * @description
 *
 */
angular
    .module('airlst.documents', [
        'ui.router',
        'airlst.components',
        'airlst.documents.main',
        'airlst.documents.templates',
        //'ngListView'
    ]);

require('./documents-routes');
