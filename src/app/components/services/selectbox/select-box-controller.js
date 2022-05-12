/**
 * @ngdoc object
 * @name components.controller:SelectBoxCtrl
 *
 * @description
 *
 */
class SelectBoxCtrl {
    constructor(config, $uibModalInstance) {
        this.instance = $uibModalInstance;
        this.config = config;
        this.selectedValue = (this.maxItems === 1) ? '' : [];
    }

    $onInit() {
        this.selectAll = this.config.store.state.selection.selectAll;
    }

    toggleSelectAll() {
        this.selectAll = !this.selectAll;
        this.config.store.commit('setSelectAll', this.selectAll);
        if (this.selectAll) {
            this.selectedValue = (this.maxItems === 1) ? '' : [];
        }
    }

    select(payload) {
        this.instance.close({data: this.selectedValue, store: this.config.store});
    }


    cancel() {
        this.instance.dismiss('cancel');
    }
}

SelectBoxCtrl.$inject = [
    'config',
    '$uibModalInstance',
];

angular
    .module('airlst.components')
    .controller('SelectBoxCtrl', SelectBoxCtrl);
