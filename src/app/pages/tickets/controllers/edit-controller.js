import defaultCustomTemplate from '../default-custom-template';
import ticketModelReducer from '../helpers/ticket-model-reducer';

/**
 * @ngdoc object
 * @name contacts.controller:TicketsEditCtrl,
 *
 * @description
 *
 */
angular
    .module('airlst.tickets')
    .controller('TicketsEditCtrl', [
        'Error',
        'ResourceCommon',
        '$q',
        '$state',
        '$stateParams',
        'NavService',
        '$http',
        'AceEditor',
        '$scope',
        TicketsEditCtrl
    ]);

function TicketsEditCtrl(Error, ResourceCommon, $q, $state, $stateParams, NavService, $http, AceEditor, $scope) {
    const vm = this;

    vm.save = save;
    vm.closeView = closeView;

    vm.currentView = 'general';
    vm.currentBackgroundImage = null;
    vm.model = {};

    _init();

    function _init() {
        if ($stateParams.store) {
            vm.store = $stateParams.store;
        }

        vm.ace_field = {};
        AceEditor.getEditor((editor) => vm.ace_field = editor);

        $scope.$watch(() => {
            return vm.use_custom_template;
        }, () => {
            if (vm.use_custom_template && !vm.model.custom_html_base_template) {
                vm.model.custom_html_base_template = defaultCustomTemplate.template;
            }
        });
        _initWatchers();

        return $http.get(`tickets/${$stateParams.id}`)
            .then(response => {
                vm.currentBackgroundImage = _.cloneDeep(_.get(response, 'data.data.background_image', null));
                vm.model = ticketModelReducer(response.data.data);
                vm.use_custom_template = !!vm.model.custom_html_base_template;
                return _updateCustomActions();
            }, () => {
                $state.go('app.tickets.index');
            });

    }

    function _initWatchers() {
        $scope.$watch(() => {
            return vm.model.background_image;
        }, () => {
            if (_.isString(vm.model.background_image)) {
                $http.get('media/files/' + vm.model.background_image).then((response) => {
                    vm.currentBackgroundImage = response.data.data;
                }, () => {
                    vm.currentBackgroundImage = null;
                })
            } else {
                vm.currentBackgroundImage = null;
            }
        })
    }

    function _updateCustomActions() {
        NavService.setStateParameters('app.tickets.details', {
            id: vm.model.id
        });
        NavService.setBreadcrumbParameters({
            ticket_name: vm.model.name
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
                label: 'Content',
                active: (vm.currentView === 'content'),
                icon: 'file-alt',
                order: 10,
                action: function () {
                    _changeView('content');
                }
            },
            {
                label: 'Ticket',
                active: (vm.currentView === 'ticket'),
                icon: 'paint-brush',
                order: 15,
                action: function () {
                    _changeView('ticket');
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

    function save(model) {
        if (!vm.use_custom_template) {
            model.custom_html_base_template = '';
        }
        $http.put(`tickets/${$stateParams.id}`, model).then(function (response) {
            vm.model = response.data.data;
            refresh();
            closeView();
        }, function (response) {
            Error.checkError(response);
        });
    }

    function closeView() {
        $state.go('app.tickets.details', {id: vm.model.id});
    }

    function refresh() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
    }

}
