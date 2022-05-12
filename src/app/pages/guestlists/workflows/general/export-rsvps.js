import ExportWorkflow from '../../../../components/workflows/general/export-workflow';

angular
    .module('airlst.guestlists')
    .factory('exportRsvps', [
        'Alert',
        '$http',
        '$uibModal',
        (Alert, $http, $uibModal) => new ExportWorkflow('rsvps', Alert, $http, $uibModal)
    ])