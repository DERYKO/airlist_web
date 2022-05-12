import ExportWorkflow from '../../../../components/workflows/general/export-workflow';


class ExportAll extends ExportWorkflow {
    constructor(Alert, $http, $uibModal) {
        super('rsvps', Alert, $http, $uibModal);
        this.key = `export-all-rsvps`;
        this.level = 'highlight';
        this.icon = 'upload';
    }

    action(payload, store) {
        console.log(store);
        store.commit('setSelectAll', true);
        super.action(payload, store).finally(() => {
            store.commit('setSelectAll', false);
        });
    }
}

angular
    .module('airlst.guestlists')
    .factory('exportAllRsvps', [
        'Alert',
        '$http',
        '$uibModal',
        (Alert, $http, $uibModal) => new ExportAll(Alert, $http, $uibModal)
    ]);
