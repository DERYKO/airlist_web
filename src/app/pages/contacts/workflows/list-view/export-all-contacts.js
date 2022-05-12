import ExportWorkflow from '../../../../components/workflows/general/export-workflow';

class ExportAll extends ExportWorkflow {
    constructor(Alert, $http, $uibModal) {
        super('contacts', Alert, $http, $uibModal);
        this.key = `export-all-contacts`;
        this.level = 'highlight';
        this.icon = 'upload';
    }

    action(payload, store) {
        store.commit('setSelectAll', true);
        super.action(payload, store).finally(()=>{
            store.commit('setSelectAll', false);
        });
    }
}

angular
    .module('airlst.contacts')
    .factory('exportAllContacts', [
        'Alert',
        '$http',
        '$uibModal',
        (Alert, $http, $uibModal) => new ExportAll(Alert, $http, $uibModal)
    ])
