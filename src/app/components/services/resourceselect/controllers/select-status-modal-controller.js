export default class SelectStatusModalController {
    constructor(modalInstance, Deposit, preSelectedState, $scope) {
        this.modalInstance = modalInstance;
        this.depositService = Deposit;
        this.scope = $scope;

        this.availableStates = {};
        this.selectedStatus = preSelectedState;

        this.depositService.getRemoteDeposit('rsvps', 'states', []).then((value) => {
            this.availableStates = value;
            if(!this.selectedStatus) {
                this.selectedStatus = _.first(Object.keys(this.availableStates));
            }
            this.scope.$applyAsync();
        });
    }

    selectStatus() {
        this.modalInstance.close({
            selectedStatus: this.selectedStatus
        })
    }

    cancel() {
        this.modalInstance.dismiss();
    }
}

SelectStatusModalController.$inject = [
    '$uibModalInstance',
    'Deposit',
    'preSelectedState',
    '$scope'
];
