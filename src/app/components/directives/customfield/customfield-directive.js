// @todo fix view paths
// Require Template
import baseTemplate from './customfield.tpl.html';
import './ace.tpl.html';
import './array.tpl.html';
import './boolean.tpl.html';
import './builder.tpl.html';
import './date.tpl.html';
import './datetime.tpl.html';
import './datetimeexact.tpl.html';
import './decimal.tpl.html';
import './enum-color-array.tpl.html';
import './color_code_select.tpl.html';
import './field.tpl.html';
import './file.tpl.html';
import './image.tpl.html';
import './integer.tpl.html';
import './number.tpl.html';
import './select.tpl.html';
import './select-box.tpl.html';
import './textarea.tpl.html';
import './color-picker.tpl.html';
import './textbox.tpl.html';
import './password.tpl.html';
import './media_image.tpl.html';
import './media_file.tpl.html';
import './html.tpl.html';


/**
 * @ngdoc directive
 */
angular
    .module('airlst.components')
    .directive('customfield', [
        function () {
            return {
                restrict: 'E',
                require: 'ngModel',
                bindToController: {
                    'ngModel': '=',
                    'definition': '=',
                    'name': '@'
                },
                scope: {
                    'ngModel': '=',
                    'definition': '=',
                    'name': '@'
                },
                link: function (scope, element, attrs, ngModelController) {

                    scope.onChange = function () {
                        ngModelController.$setViewValue(scope.ngModel);
                    };

                    //set default value if null
                    ngModelController.$render = function () {
                        scope.ngModel = ngModelController.$modelValue;
                        if (_.isUndefined(scope.ngModel) && !_.isUndefined(scope.definition.default)) {
                            scope.ngModel = scope.definition.default;
                        }
                    };

                },
                controller: CustomFieldDirectiveController,
                controllerAs: 'field',
                templateUrl: baseTemplate
            }
        }
    ]);


class CustomFieldDirectiveController {

    constructor($scope) {
        this.scope = $scope;
        this.lodash = _;
        this.customIdentifier = 'custom-field-' + Math.floor(Math.random() * 1000) + 1;

        this._initWatchers()
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.ngModel
        }, (current, previous) => {
            if (this.definition) {
                if (this.definition.onChange) {
                    this.definition.onChange(current, previous, this.scope.$parent.ngModel, this.scope.$parent.$parent.$index);
                }
            }
        });

        this.scope.$watch(() => {
            return this.ngModel ? this.ngModel.type : undefined
        }, () => {
            if (this.definition && this.definition.type === 'builder') {
                if (!this.ngModel || this.ngModel.length === 0) {
                    this.ngModel = {};
                }
                if (this.ngModel && this.ngModel.type === 'select') {
                    this.ngModel.enum = this.ngModel.enum ? this.ngModel.enum : [];
                }
            }
        });
    }

    updateModelValue(newValue) {
        this.ngModel = newValue;
    }

    updateFileModel(file) {
        if (_.isObject(file)) {
            this.ngModel = _.get(file, 'uuid', null);
        } else {
            this.ngModel = null;
        }
        this.scope.$applyAsync();
    }
}

CustomFieldDirectiveController.$inject = [
    '$scope'
];
