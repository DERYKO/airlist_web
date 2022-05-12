import template from './preview-directive.tpl.html';

class PreviewController {
    constructor() {
        let dpiConverterElement = angular.element('#dpi-converter');

        dpiConverterElement.css('height', '1mm');
        this.pixelsPerMm = dpiConverterElement.height();
        dpiConverterElement.css('height', 'in');
        this.ppi = dpiConverterElement.height();
        this.conversionRatio = 96 / this.ppi;
    }
}

PreviewController.$inject = [

];

/**
 * @ngdoc directive
 * @name preview.directive:preview
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module='preview'>
 <file name='index.html'>
 <preview model=''></preview>
 </file>
 </example>
 *
 */
angular
    .module('airlst.tickets')
    .directive('preview', preview);

function preview() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: PreviewController,
        bindToController: {
            model: '=',
            backgroundImage: '<'
        }
    };
}
