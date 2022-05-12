class HeartFinanceDashboardController {
    constructor(){
        this.loading = false;
    }
}

HeartFinanceDashboardController.$inject = [];

angular
    .module('airlst.dashboard')
    .controller('HeartFinanceDashboardController', HeartFinanceDashboardController);
