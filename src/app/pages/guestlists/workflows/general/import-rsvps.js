import ImportRsvpsWorkflow from '../../../../components/workflows/general/import-workflow';

class ImportRsvps extends ImportRsvpsWorkflow {
    constructor(Alert, $http, $uibModal, $state) {
        super('rsvps', Alert, $http, $uibModal);
        this.key = `import-rsvps`;
        this.level = 'highlight';
        this.icon = 'download';
        this.order = 30;
        this.state = $state;
    }

    action(payload, store) {
        console.log(store);
        return this.state.go('app.guestlists.rsvps.import', {store: store});
    }
}

angular
    .module('airlst.guestlists')
    .factory('importRsvps', [
        'Alert',
        '$http',
        '$uibModal',
        '$state',
        (Alert, $http, $uibModal, $state) => new ImportRsvps(Alert, $http, $uibModal, $state)
    ]);
