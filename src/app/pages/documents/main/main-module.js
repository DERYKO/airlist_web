/**
 * @ngdoc object
 * @name main
 * @description
 *
 */
angular
    .module('airlst.documents.main', [
        'ui.router',
        'airlst.components',
        //'ngListView'
    ]);

// Directives
require('./directives/documents/documents-directive');

// Factories
require('./factories/document-factory');

// Store
require('./store/document');