/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.seatplans')
    .controller('SeatplansElementsCtrl', [
        '$state',
        'SweetAlert',
        'model',
        'Env',
        '$http',
        '$element',
        '$scope',
        '$uibModal',
        SeatplansElementsCtrl
    ]);
//todo: test after enabling fp
function SeatplansElementsCtrl($state, SweetAlert, model, Env, $http, $element, $scope, $uibModal) {
    var vm = this;
    vm.group = model;
    vm.builder = null;
    vm.canvasElement = angular.element($element[0].querySelector('canvas'));
    vm.drawInfo = {};
    vm.drawing = null;

    vm.cancel = cancel;
    vm.save = save;
    vm.editElement = editElement;
    vm.addNewChild = addNewChild;
    vm.removeElement = removeElement;
    vm.duplicateElement = duplicateElement;

    $scope.$watch(angular.bind(this, function () {
        return this.builder;
    }), function (newVal) {
        if (newVal) {
            refreshPreview();
        }
    });

    function refreshPreview() {
        vm.drawInfo = prepareDrawInfoFromResponse(_.cloneDeep(vm.builder));
        resizeCanvas();
        createDrawing();
    }

    function init() {
        $http.get(Env.apiUrl + '/seatplans/groups/' + vm.group.id + '/builder').then(function (response) {
            vm.builder = response.data;
        }, function (response) {
            SweetAlert.error(locale.getString('seatplans.seatplans.messages.builder_error'), locale.getString('seatplans.seatplans.messages.builder_error_message'));
        });
    }

    function createDrawing() {
        if (vm.drawing) {
            vm.drawing.destruct();
        }
        vm.drawing = new AirlstSeatPlanDrawing(vm.canvasElement[0],
            vm.drawInfo, {
                click: function (e, element) {
                    vm.editElement(element.original);
                }
            });
    }

    function prepareDrawInfoFromResponse(dataFromApi) {
        dataFromApi.objects = prepareDrawObjectsList(dataFromApi.objects, vm.builder.objects);
        return dataFromApi;
    }

    function prepareDrawObjectsList(drawObjectList, originalList) {
        for (var i = 0; i < drawObjectList.length; i++) {
            var currentDrawObject = drawObjectList[i];
            currentDrawObject.original = originalList[i];
            if (currentDrawObject.objects && currentDrawObject.objects.length) {
                currentDrawObject.objects = prepareDrawObjectsList(currentDrawObject.objects, originalList[i].objects);
            }

            if (currentDrawObject.bookable) {
                currentDrawObject.status = 'unbooked';
            }

            currentDrawObject.clickable = true;
            currentDrawObject.selectable = false;
        }

        return drawObjectList;
    }

    function cancel() {
        $state.go('app.seatplans.details', {id: vm.group.seatplan.data.id});
    }

    function save() {
        $http.put(Env.apiUrl + '/seatplans/groups/' + vm.group.id + '/builder', vm.builder).then(function (response) {
            vm.builder = response.data;
        }, function (response) {
            SweetAlert.error(locale.getString('seatplans.seatplans.messages.builder_save_error'), locale.getString('seatplans.seatplans.messages.builder_save_error_message'));
        });
    }

    function editElement(elementToEdit, parentElement) {
        var originalBuilder = _.cloneDeep(vm.builder);
        var modalInstance = $uibModal.open({
            animation: true,
            scope: $scope,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'editElementModal.html',
            appendTo: angular.element('#groupElementsTreeContainer'),
            controller: function ($scope, element, parentElement) {
                var modalVm = this;

                modalVm.element = element;
                modalVm.original = _.cloneDeep(element);
                modalVm.labelTypes = [
                    {
                        mainGroup: 'vertical',
                        subGroup: 'left',
                        label: 'Vertical - left'
                    },
                    {
                        mainGroup: 'vertical',
                        subGroup: 'center',
                        label: 'Vertical - center'
                    },
                    {
                        mainGroup: 'vertical',
                        subGroup: 'right',
                        label: 'Vertical - right'
                    },
                    {
                        mainGroup: 'horizontal',
                        subGroup: 'top',
                        label: 'Horizontal - top'
                    },
                    {
                        mainGroup: 'horizontal',
                        subGroup: 'center',
                        label: 'Horizontal - center'
                    },
                    {
                        mainGroup: 'horizontal',
                        subGroup: 'bottom',
                        label: 'Horizontal - bottom'
                    }
                ];

                modalVm.ok = function () {
                    modalInstance.close();
                    element = modalVm.element;
                    refreshPreview();
                };

                modalVm.cancel = function () {
                    vm.builder = originalBuilder;
                    modalInstance.close();
                };

            },
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                element: function () {
                    return elementToEdit;
                },
                parentElement: function () {
                    return parentElement;
                }
            }
        });
    }

    function addNewChild(elementToAppend) {
        var newElement = {
            title: 'New element',
            pos: {
                x: 0,
                y: 0
            },
            size: {
                x: 0,
                y: 0
            },
            bookable: false,
            labels: {}
        };
        elementToAppend.objects.push(newElement);
        editElement(newElement);
        refreshPreview();
    }

    function removeElement(parent, elementToRemove) {
        var index = parent.indexOf(elementToRemove);

        if (index > -1) {
            parent.splice(index, 1);
            refreshPreview();
        }
    }

    function duplicateElement(parent, elementToDuplicate) {
        var newElement = _.cloneDeep(elementToDuplicate);

        if (newElement.id) {
            delete newElement.id;
        }

        newElement.title = newElement.title + ' (copy)';

        parent.push(newElement);
    }

    function resizeCanvas() {
        var newWidth = vm.canvasElement.parent().width(),
            newHeight = newWidth * (vm.drawInfo.grid_height / vm.drawInfo.grid_width);

        vm.canvasElement.attr('width', newWidth);
        vm.canvasElement.attr('height', newHeight);
    }

    angular.element(window).bind('resize', function () {
        resizeCanvas();
        if (vm.drawing) {
            vm.drawing.redraw();
        }
    });

    angular.element(vm.canvasElement.parent()).bind('resize', function () {
        resizeCanvas();
        if (vm.drawing) {
            vm.drawing.redraw();
        }
    });

    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        console.log('tab changed');
        resizeCanvas();
        if (vm.drawing) {
            vm.drawing.redraw();
        }
    });

    init();

}