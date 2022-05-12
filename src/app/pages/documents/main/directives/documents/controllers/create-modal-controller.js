/**
 * @ngdoc object
 * @name documents.main:PositionLinksCreateModalCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.documents.main')
    .controller('DocumentCreateModalCtrl', [
        'model',
        'DocumentTemplate',
        'closeFunction',
        '$scope',
        'SweetAlert',
        DocumentCreateModalCtrl
    ]);

function DocumentCreateModalCtrl(model, DocumentTemplate, closeFunction, $scope, SweetAlert) {
    var vm = this;

    vm.template = {};
    vm.templates = [];
    vm.model = {};

    vm.close = close;
    vm.save = save;

    init();

    function init() {
        initTemplates();
        initWatchers();
    }

    function initTemplates() {
        vm.templates = [];
        DocumentTemplate.getList().then(function (result) {
            _.forEach(result, function (v, k) {
                vm.templates.push(v.plain());
            });

            vm.template = vm.templates[0];
        });
    }

    function initWatchers() {
        $scope.$watch('vm.template', function (newValue) {
            vm.model.document_template_id = newValue.id;
            var fieldsToCopyFromPosition = [
                'title'
            ];

            for (var i = 0; i < fieldsToCopyFromPosition.length; i++) {
                var fieldName = fieldsToCopyFromPosition[i];

                vm.model[fieldName] = newValue[fieldName];
            }
        });
    }

    function save() {
        var dataForApi = _.cloneDeep(vm.model);

        model.post(dataForApi).then(function () {
            SweetAlert.success('success', 'document created');
            vm.close();
        });
    }

    function close() {
        closeFunction();
    }
}