/**
 * @ngdoc object
 * @name picklists.controller:PicklistsEditCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .controller('PicklistsEditCtrl', [
        'Alert',
        '$http',
        'NavService',
        'Picklist',
        '$state',
        '$stateParams',
        PicklistsEditCtrl
    ]);

function PicklistsEditCtrl(Alert, $http, NavService, Picklist, $state, $stateParams) {

    var vm = this;
    vm.customs = _.range(1, 21);
    vm.save = save;
    vm.closeView = closeView;

    init();

    function init() {
        if ($stateParams.store) {
            vm.store = $stateParams.store;
        }
        loadPicklist().then(setupEditor);
    }

    function loadPicklist() {
        return $http.get(`picklists/${$stateParams.pid}`).then(response => {
            vm.model = response.data.data;
            vm.headline = vm.model.name;
            vm.currentView = 'general'
            NavService.setBreadcrumbParameters({
                picklist_name: vm.model.name
            });
            return vm.model;
        }, () => {
            Alert.error('Picklist not found');
            closeView();
        });


    }

    function setupEditor() {
        return Picklist.getSchema().then(function (schema) {
            vm.schema = schema;
        });
    }

    function closeView() {
        $state.go('app.picklists.contacts.settings', {pid: vm.model.id, picklist: vm.model});
    }

    function save(model) {
        $http.put(`picklists/${model.id}`, model).then(function () {
            vm.model = model;
            closeView();
        }, response => Alert.handle(response));
    }
}