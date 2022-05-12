import ExportWorkflow from '../../../../components/workflows/general/export-workflow';

angular
    .module('airlst.messages')
    .factory('exportMessages', [
        'Alert',
        '$http',
        '$uibModal',
        (Alert, $http, $uibModal) => new ExportWorkflow('messages', Alert, $http, $uibModal, {
            excel: 'Excel',
            csv: 'CSV',
        })
    ])