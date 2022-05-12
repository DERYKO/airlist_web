/**
 * @ngdoc object
 * @name contacts.controller:PassbooksCreateCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .controller('PassbooksCreateCtrl', [
        'Alert',
        'Env',
        'ResourceCommon',
        '$state',
        '$stateParams',
        'Upload',
        '$q',
        'NavService',
        'AceEditor',
        PassbooksCreateCtrl
    ]);

function PassbooksCreateCtrl(Alert, Env, ResourceCommon, $state, $stateParams, Upload, $q, NavService, AceEditor) {
    const vm = this;

    vm.heading = 'Create new Passbook';
    vm.currentView = 'labels';

    vm.model = $stateParams.model || {
        background_color: {
            red: 0,
            blue: 0,
            green: 0
        },
        fore_color: {
            red: 255,
            blue: 255,
            green: 255
        },
        label_color: {
            red: 0,
            blue: 0,
            green: 0
        }
    };

    vm.ace_field = {};
    AceEditor.getEditor((editor) => vm.ace_field = editor);

    vm.save = createPassbook;
    vm.close = close;

    _init();

    function _init() {
        _updateCustomActions();
    }

    function _updateCustomActions() {
        let customs = [
            {
                label: 'Labels',
                active: (vm.currentView === 'labels'),
                icon: 'heading',
                order: 5,
                action: function () {
                    _changeView('labels');
                }
            },
            {
                label: 'Texts',
                active: (vm.currentView === 'texts'),
                icon: 'font',
                order: 10,
                action: function () {
                    _changeView('texts');
                }
            },
            {
                label: 'Colors',
                active: (vm.currentView === 'colors'),
                icon: 'paint-brush',
                order: 15,
                action: function () {
                    _changeView('colors');
                }
            },
            {
                label: 'Images',
                active: (vm.currentView === 'images'),
                icon: 'images',
                order: 20,
                action: function () {
                    _changeView('images');
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

    function createPassbook(model) {
        return Upload.upload({
            url: Env.apiUrl.concat('/passbooks'),
            data: model
        }).then(function (response) {
            vm.model = response.data.data;
            close();
        }, err => Alert.handle(err));
    }

    function close() {
        $state.go('app.passbooks.index');
    }

}
