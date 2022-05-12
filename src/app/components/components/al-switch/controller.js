/**
 * @ngdoc controller
 * @name components.components:ComponentsAlSwitchController
 * @restrict EA
 * @element
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .controller('ComponentsAlSwitchController', [
        '$element',
        '$scope',
        ComponentsSelectizeController
    ]);

function ComponentsSelectizeController($element, $scope) {
    let vm = this,
        defaultConfig = {
            trueValue: true,
            falseValue: false,
            trueLabel: 'Yes',
            falseLabel: 'No',
            color: 'green',
            disabled: false,
            name: '',
            id: 'switch-' + Math.random() * (100 - 1) + 1
        };

    vm.internalConfig = {};

    vm.changeAction = changeAction;

    _init();

    // Internal functions
    function _init() {
        _initWatchers();
        _initConfig();
    }

    function _initWatchers() {
        $scope.$watch('vm.config', function () {
            _initConfig();
        });
    }

    function _initConfig() {
        if (!vm.config) {
            vm.config = {};
        }

        vm.internalConfig = _.defaultsDeep(vm.config, defaultConfig);
    }

    // Functions to bind for outside use
    function changeAction(newValue) {
        vm.onChange({newValue: newValue});
    }
}
