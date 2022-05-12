export default class QrCodeController {
    constructor($uibModalInstance, code) {
        this.modalInstance = $uibModalInstance;
        this.code = code;
    }

    close() {
        this.modalInstance.close();
    }
}

QrCodeController.$inject = [
    '$uibModalInstance',
    'code'
];
