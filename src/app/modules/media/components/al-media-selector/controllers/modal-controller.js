export default class AlMediaSelectorModalController {

    constructor($uibModalInstance, $scope, http, env, startDirectory, allowedMimes) {
        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.http = http;
        this.env = env;

        this.selectedFile = null;
        this.startDirectory = startDirectory || null;
        this.allowedMimes = allowedMimes || [];
    }

    close() {
        this.modalInstance.close({
            selectedFile: this.selectedFile
        });
    }

    selected(file) {
        this.selectedFile = file;
        this.scope.selectedFile = file;
        this.scope.$applyAsync();
        this.close();
    }
}

AlMediaSelectorModalController.$inject = [
    '$uibModalInstance',
    '$scope',
    '$http',
    'Env',
    'startDirectory',
    'allowedMimes'
];
