import defaultCustomTemplate from '../default-custom-template';

/**
 * @ngdoc object
 * @name contacts.controller:TicketsCreateCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .controller('TicketsCreateCtrl', [
        'Error',
        'locale',
        'ResourceCommon',
        '$state',
        '$stateParams',
        'SweetAlert',
        'Ticket',
        '$q',
        'NavService',
        'AceEditor',
        '$scope',
        TicketsCreateCtrl
    ]);

function TicketsCreateCtrl(Error, locale, ResourceCommon, $state, $stateParams, SweetAlert, Ticket, $q, NavService, AceEditor, $scope) {
    var vm = this;
    vm.headline = 'Create new PDF Ticket';
    vm.model = {
        styling: {
            size: {
                length: 120,
                width: 240
            },
            text: {
                size: 4,
                top: 40,
                left: 80,
                color: '#000'
            },
            qrCode: {
                size: 53,
                top: 35,
                left: 17
            }
        }
    };
    vm.currentView = 'general';
    vm.use_custom_template = false;
    vm.currentBackgroundImage = null;

    vm.ace_field = {};
    AceEditor.getEditor((editor) => vm.ace_field = editor);

    vm.save = createTicket;
    vm.closeView = showIndex;

    _init();

    function _init() {
        _updateCustomActions();
        _initWatchers();
        $scope.$watch(() => {
            return vm.use_custom_template;
        }, () => {
            if (vm.use_custom_template && !vm.model.custom_html_base_template) {
                vm.model.custom_html_base_template = defaultCustomTemplate.template;
            }
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

    function createTicket(fields) {
        if (!vm.use_custom_template) {
            fields.custom_html_base_template = '';
        }
        Ticket.post(fields).then(function (model) {
            SweetAlert.swal(locale.getString('tickets.ticket_saved'), locale.getString('tickets.ticket_saved_message'), 'success');
            refresh();
            showIndex();
        }, function (response) {
            Error.checkError(response);
        });
    }

    function showIndex() {
        $state.go('app.tickets.index');
    }

    function refresh() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
    }

}
