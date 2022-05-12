/**
 * @ngdoc controller
 * @name components.directive:selectBox
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="components">
 <file name="index.html">
 <select-box></select-box>
 </file>
 </example>
 *
 */
angular
    .module('airlst.components')
    .controller('ComponentsAlWizardController', [
        '$element',
        '$scope',
        ComponentsSelectizeController
    ]);

function ComponentsSelectizeController($element, $scope) {
    let vm = this;

    vm.clickAction = clickAction;
    _init();

    // Internal functions
    function _init() {
        _initWatchers();
    }

    function _initWatchers() {
        // $scope.$watch('vm.steps', function(newSteps){
        //
        // });
    }

    // Functions to bind for outside use
    function clickAction(step){
        vm.onChange({selectedStep: step});
    }
}
