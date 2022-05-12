import selectBoxModalTemplate from './select-box.tpl.html';
import './select-box-controller';

class SelectBox {
    constructor($uibModal, $q) {
        this.modal = $uibModal;
        this.promise = $q;
    }

    select(store, config, maxItems) {

        this.config = _.defaultsDeep(config || {}, {
            store: store,
                valueField: 'id',
                displayField: 'name',
                maxItems: maxItems || 1
        });

        return this.modal
            .open({
                animation: true,
                backdrop: true,
                templateUrl: selectBoxModalTemplate,
                controller: 'SelectBoxCtrl',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    config: this.config
                }
            })
            .result.then(
                selected => this.promise.resolve(selected),
                rejection => this.promise.reject(rejection)
            );
    }

    single(store, config) {
        return this.select(store, config, 1);
    }

    multiple(store, config) {
        return this.select(store, config, 25);
    }

}


/**
 * @ngdoc service
 * @name components.service:SelectBox
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .service('SelectBox', SelectBox);

SelectBox.$inject = ['$uibModal', '$q'];
