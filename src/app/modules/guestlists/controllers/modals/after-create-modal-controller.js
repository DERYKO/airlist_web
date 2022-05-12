export default class GuestlistAfterCreateModalController {

    constructor($scope, $injector, $uibModalInstance, guestlist) {
        this.scope = $scope;
        this.injector = $injector;
        this.modalInstance = $uibModalInstance;
        this.guestlist = guestlist;
        this.angularState = this.injector.get('$state');
        this.translate = this.injector.get('$translate');
    }

    dismiss() {
        this.modalInstance.dismiss();
    }

    goToImport() {
        this.angularState.go('app.guestlists.rsvps.import', {gid: this.guestlist.id});
        this.modalInstance.close();
    }

    goToSettings() {
        this.angularState.go('app.guestlists.rsvps.edit-settings', {gid: this.guestlist.id, editorView: 'general'});
        this.modalInstance.close();
    }

    goToFieldDefinition() {
        this.angularState.go('app.guestlists.rsvps.edit-settings', {gid: this.guestlist.id, editorView: 'fields'});
        this.modalInstance.close();
    }
}

GuestlistAfterCreateModalController.$inject = [
    '$scope',
    '$injector',
    '$uibModalInstance',
    'guestlist'
];
