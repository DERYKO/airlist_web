/**
 * @ngdoc object
 * @name templates
 * @description
 *
 */
angular
    .module('airlst.templates.main', [
        'ui.router',
        'airlst.components'
    ]);

require('./main-routes');

// Controllers
require('./controllers/templates-create-controller');
require('./controllers/templates-details-controller');
require('./controllers/templates-edit-controller');
require('./controllers/templates-lists-controller');

// Directives
require('./directives/beefree/beefree-directive');

// Factories
require('./factories/template-factory');

// Workflows
// List
require('./workflows/create-template');
require('./workflows/view-template');

// Details
require('./workflows/edit-template');
require('./workflows/duplicate-template');
require('./workflows/fix-template');
require('./workflows/archive-template');
require('./workflows/delete-template');
require('./workflows/restore-template');
require('./workflows/send-template');