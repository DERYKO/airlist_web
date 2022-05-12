/**
 * @ngdoc object
 * @name passbooks.controller:PassbooksCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.passbooks')
    .controller('PassbookDetailsCtrl', [
        'Alert',
        'Blob',
        'FileSaver',
        '$http',
        '$stateParams',
        'ResourceSelect',
        '$state',
        '$q',
        'NavService',
        'Workflows',
        PassbookDetailsCtrl
    ]);

function PassbookDetailsCtrl(Alert, Blob, FileSaver, $http, $stateParams, ResourceSelect, $state, $q, NavService, Workflows) {
    const vm = this;

    vm.currentView = 'general';
    vm.hidePassbook = hidePassbook;

    init();

    function init() {
        if ($stateParams.store) {
            vm.manager = $stateParams.store;
        }
        loadPassbook().then(_updateCustomActions);
    }

    function loadPassbook() {

        if ($stateParams.passbook) {
            vm.model = $stateParams.passbook;
            return $q.resolve(vm.model)
        }
        return $http.get(`passbooks/${$stateParams.id}`).then(response => {
            vm.model = response.data.data;
            return vm.model;

        }, () => {
            Alert.error('Passbook not found');
            $state.go('app.passbooks.index');
        });


    }

    function _updateCustomActions() {
        NavService.setBreadcrumbParameters({
            passbook_name: vm.model.name
        });

        let customs = [
            {
                label: 'General',
                active: (vm.currentView === 'general'),
                icon: 'sitemap',
                order: 5,
                action: function () {
                    _changeView('general');
                }
            },
            {
                label: 'Images',
                active: (vm.currentView === 'images'),
                icon: 'images',
                order: 10,
                action: function () {
                    _changeView('images');
                }
            }
        ];

        customs.sort(function (a, b) {
            return a.order - b.order;
        });

        NavService.setSideNavCustoms(customs);

        const actions = _(Workflows.getWorkflows('passbooks::details'))
            .filter(workflow => {
                return vm.model.archived ? workflow.level === 'archived-highlight' : workflow.level === 'highlight';
            })
            .map(workflow => {
                if (!workflow.onClick) {
                    workflow.onClick = workflow.action;
                }
                workflow.action = () => {
                    workflow.onClick(vm.model, vm);
                };
                workflow.order = workflow.order || 30;
                return workflow;
            })
            .sortBy('order', 'asc')
            .value();

        NavService.overrideMainSideNavActions(actions);
    }

    function _changeView(view) {
        vm.currentView = view;
        _updateCustomActions();
    }

    function hidePassbook() {
        $state.go('app.passbooks.index');
    }

}
