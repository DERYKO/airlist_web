/**
 * @ngdoc object
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .controller('PicklistsCreateCtrl', [
        'locale',
        'Restangular',
        'Picklist',
        '$state',
        '$stateParams',
        'SweetAlert',
        'NavService',
        PicklistsCreateCtrl
    ]);

function PicklistsCreateCtrl(locale, Restangular, Picklist, $state, $stateParams, SweetAlert, NavService) {
    let vm = this;
    vm.model = {
        permission: 'public'
    };
    vm.customs = _.range(1, 21);

    vm.currentView = 'general';
    vm.save = save;
    vm.closeView = closeView;
    vm.headline = 'Create new Picklist';

    init();

    function init() {
        setupEditor().then(function () {
            if ($state.current.name === 'app.picklists.multiple') {
                if (!$stateParams.rows) {
                    SweetAlert.error('You must first select rows before updating them');
                    $state.go('app.picklists.index');
                }
                vm.multiple = true;
                vm.schema.required = [];
                vm.selectedRows = $stateParams.rows;
            } else {
                vm.model = {
                    addressbook: true,
                    permission: 'public'
                };
            }
        });

        _updateCustomActions();
    }

    function _updateCustomActions() {
        let customs = [
            {
                label: 'General',
                active: (vm.currentView === 'general'),
                icon: 'sitemap',
                order: 5,
                action: function () {
                    _changeView('general');
                }
            }
        ];

        customs.sort(function (a, b) {
            return a.order - b.order;
        });

        NavService.setSideNavCustoms(customs);
    }

    function _changeView(view) {
        vm.currentView = view;
        _updateCustomActions();
    }

    function setupEditor() {
        return Picklist.getSchema().then(function (schema) {
            vm.schema = schema;
        });
    }

    function save(model) {
        var promise;

        if (vm.multiple) {
            promise = Restangular.one('picklists').doPUT({
                fields: model,
                keys: vm.selectedRows
            })
        } else {
            promise = Picklist.post(model);
        }

        promise.then(function () {
            SweetAlert.swal(locale.getString('sweetalerts.records_saved'), locale.getString('sweetalerts.records_saved_message'), 'success');
            closeView();
        }, function (response) {
            SweetAlert.swal(locale.getString('sweetalerts.saving_unsuccessful'), response.data.message, 'error');
        });
    }

    function closeView() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.picklists.index');
    }
}
