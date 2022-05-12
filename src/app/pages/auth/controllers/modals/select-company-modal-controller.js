class SelectCompanyModalController {
    constructor(modalInstance, availableCompanies) {
        this.modalInstance = modalInstance;
        this.availableCompanies = availableCompanies;

        this.selectedCompany = _.first(availableCompanies);
    }

    selectCompany() {
        this.modalInstance.close({
            selectedCompany: this.selectedCompany
        })
    }

    cancel() {
        this.modalInstance.dismiss();
    }
}

SelectCompanyModalController.$inject = [
    '$uibModalInstance',
    'availableCompanies'
];

/**
 * @ngdoc object
 * @name auth.controller:AuthCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.auth')
    .controller('SelectCompanyModalController', SelectCompanyModalController);
