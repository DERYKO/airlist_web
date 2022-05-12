/**
 * @ngdoc object
 * @name settings.controller:SettingsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.settings')
    .controller('CustomsCtrl', [
        '$auth',
        'locale',
        'Setting',
        '$window',
        'SweetAlert',
        'NavService',
        CustomsCtrl
    ]);

function CustomsCtrl($auth, locale, Setting, $window, SweetAlert, NavService) {
    var vm = this;
    vm.currentView = 'contact-attr';
    vm.customs = _.range(1, 41);
    vm.guestlistCustoms = _.range(1, 31);
    vm.saveCustom = saveCustom;

    init();

    function init() {
        $auth.getUser().then(function (user) {
            vm.user = user;
            vm.model = user.company.data;
            _.each(user.company.data, function (value, key) {
                if (_.startsWith(key, 'custom_') && _.isArray(value)) {
                    user.company.data[key] = {};
                }
            });
            _updateCustomActions();
        });
    }

    function _updateCustomActions() {
        NavService.setStateParameters({
            id: vm.model.id,
            template: vm.model
        });
        NavService.setBreadcrumbParameters({
            template_name: vm.model.name
        });
        let customs = [
            {
                label: 'Contact attributes',
                active: (vm.currentView === 'contact-attr'),
                icon: 'id-card',
                order: 5,
                action: function () {
                    _changeView('contact-attr');
                }
            },
            {
                label: 'Guestlist attributes',
                active: (vm.currentView === 'guestlist-attr'),
                icon: 'users',
                order: 10,
                action: function () {
                    _changeView('guestlist-attr');
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

    function saveCustom(model) {
        Setting.updateCompany(model).then(function () {
            SweetAlert.swal('Success', 'Saving the custom fields was successful', 'success');
            vm.model = model;
        }, function () {
            SweetAlert.swal('Failed', 'Saving the custom fields failed', 'error');
        });
    }

}
