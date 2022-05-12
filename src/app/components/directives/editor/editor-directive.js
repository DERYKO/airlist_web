import template from './editor-directive.tpl.html';


/**
 * @ngdoc directive
 * @name components.directive:editor
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <editor schema="" form="" model="" onSave=""></editor>
 *
 */
angular
    .module('airlst.components')
    .directive('editor', editor);

function editor() {
    return {
        restrict: 'EA',
        scope: {},
        bindToController: {
            schema: '=',
            form: '=',
            model: '=',
            onSave: '&',
            onCancel: '&'
        },
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: [
            '$q',
            '$log',
            EditorCtrl
        ]
    };
}

function EditorCtrl($q, $log) {
    var vm = this;
    vm._model = _.isUndefined(vm.model) ? {} : _.cloneDeep(vm.model);

    vm.save = saveModel;
    vm.cancel = cancelEditing;
    $q.resolve(vm.schema).then(function () {
        vm.form = _.map(vm.form, function (field) {
            if (!_.isObject(field)) {
                field = {key: field};
            }
            field = _.defaultsDeep(field, _.get(vm.schema.properties, [field.key, 'x-schema-form'], {}), vm.schema.properties[field.key]);
            if (field.type == 'string') {
                if (field.enum) {
                    field.type = 'select';
                } else if (field.format) {
                    field.type = field.format;
                } else {
                    field.type = 'textbox';
                }
            }
            return field;
        });

    });

    vm.log = $log;


    function saveModel(model, form) {
        if (form.$valid) {
            vm.onSave({model: model});
        }
    }

    function cancelEditing() {
        vm.onCancel();
    }
}
