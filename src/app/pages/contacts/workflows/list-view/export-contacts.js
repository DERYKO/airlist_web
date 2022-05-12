import ExportWorkflow from '../../../../components/workflows/general/export-workflow';

angular
    .module('airlst.contacts')
    .factory('exportContacts', [
        'Alert',
        '$http',
        '$uibModal',
        (Alert, $http, $uibModal) => new ExportWorkflow('contacts', Alert, $http, $uibModal)
    ])