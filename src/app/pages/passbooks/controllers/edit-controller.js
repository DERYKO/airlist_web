import passbookModelReducer from '../helpers/passbook-model-reducer';

/**
 * @ngdoc object
 * @name contacts.controller:PassbooksEditCtrl,
 *
 * @description
 *
 */
angular
    .module('airlst.passbooks')
    .controller('PassbooksEditCtrl', [
        'Alert',
        '$http',
        'Env',
        'ResourceCommon',
        '$q',
        '$state',
        '$stateParams',
        'Upload',
        'NavService',
        'AceEditor',
        PassbooksEditCtrl
    ]);

function PassbooksEditCtrl(Alert, $http, Env, ResourceCommon, $q, $state, $stateParams, Upload, NavService, AceEditor) {
    const vm = this;

    vm.currentView = 'labels';
    vm.imageModels = {};
    vm.headline = '';

    vm.ace_field = {};
    AceEditor.getEditor((editor) => vm.ace_field = editor);

    vm.save = save;
    vm.cancelEditing = closeView;

    function init() {
        if ($stateParams.store) {
            vm.manager = $stateParams.store;
        }
        loadPassbook().then(_updateCustomActions);
    }

    function loadPassbook() {
        if ($stateParams.passbook) {
            vm.model = passbookModelReducer($stateParams.passbook);
            return $q.resolve(vm.model)
        }

        return $http.get(`passbooks/${$stateParams.id}`).then(response => {
            vm.model = passbookModelReducer(response.data.data);
            return vm.model;
        }, () => {
            Alert.error('Passbook not found');
            $state.go('app.passbooks.index');
        });


    }

    init();

    function _updateCustomActions() {
        vm.headline = vm.model.name;
        NavService.setStateParameters('app.passbooks.details', {
            id: vm.model.id
        });
        NavService.setBreadcrumbParameters({
            passbook_name: vm.model.name
        });
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
                active: (vm.currentView === 'Texts'),
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


    function save(model) {
        model._method = 'PUT';
        if (_.isFunction(model.plain)) {
            model = model.plain();
        }

        return Upload.upload({
            url: Env.apiUrl.concat('/passbooks/' + model.id),
            data: model
        })
            .then(function (response) {
                vm.model = response.data.data;
                closeView();
            }, err => Alert.checkError(err));
    }


    function closeView() {
        $state.go('app.passbooks.details', {id: vm.model.id, passbook: vm.model, store: vm.store});
    }

}
