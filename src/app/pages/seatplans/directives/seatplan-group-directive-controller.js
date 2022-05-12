/**
 * @ngdoc directive
 * @name payments.directive:contact
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <payments contact=''></payments>
 *
 */
angular
    .module('airlst.seatplans')
    .controller('SeatplanGroupCtrl', [
        '$attrs',
        '$element',
        '$http',
        'Env',
        SeatplanGroupCtrl
    ]);

function SeatplanGroupCtrl($attrs, $element, $http, Env) {
    var vm = this;

    vm.error = '';
    vm.showError = false;
    vm.loading = false;
    vm.showCanvas = false;
    vm.bookings = vm.bookings || [];
    vm.canvasElement = angular.element($element[0].querySelector('canvas'));
    vm.drawing = null;
    vm.drawInfo = null;

    $attrs.$observe('groupId', function (val) {
        vm.groupId = val;
        init();
    });

    $attrs.$observe('bookings', function (val) {
        vm.groupId = val;
        init();
    });

    $attrs.$observe('clickable', function (val) {
        vm.clickable = !(val === 'false');
        init();
    });

    init();

    function init() {
        if (!vm.groupId) {
            showError('Invalid Group ID given');
        }
        startLoading();

        $http.get(Env.apiUrl + '/seatplans/groups/' + vm.groupId + '/builder').then(function (response) {
            vm.drawInfo = prepareDrawInfoFromResponse(_.cloneDeep(response.data));
            createDrawing();
        }, function (response) {
            showError('Error while Loading canvas data');
        });
    }

    function createDrawing() {
        resizeCanvas();
        if (vm.drawing) {
            vm.drawing.destruct();
        }
        vm.drawing = new AirlstSeatPlanDrawing(vm.canvasElement[0],
            vm.drawInfo, {
                click: function (e, clickedElement) {
                    if (vm.onClick) {
                        vm.onClick({e: e, clickedElement: clickedElement});
                    }
                },
                dblClick: function (e, clickedElement) {
                    console.log(clickedElement);
                    if (vm.onDblClick) {
                        vm.onDblClick({e: e, clickedElement: clickedElement});
                    }
                },
                selectionChange: function (triggeredElement, selectionState) {
                    if (vm.onSelectionChange) {
                        vm.onSelectionChange({triggeredElement: triggeredElement, selectionState: selectionState});
                    }
                },
                unSelectable: function (clickedElement) {
                    if (vm.onUnSelectable) {
                        vm.onUnSelectable({clickedElement: clickedElement});
                    }
                }
            });
        vm.showCanvas = true;
        stopLoading();
    }

    function prepareDrawInfoFromResponse(dataFromApi) {
        dataFromApi.objects = prepareDrawObjectsList(dataFromApi.objects);
        return dataFromApi;
    }

    function prepareDrawObjectsList(drawObjectList) {
        for (var i = 0; i < drawObjectList.length; i++) {
            var currentDrawObject = drawObjectList[i];
            if (currentDrawObject.objects && currentDrawObject.objects.length) {
                currentDrawObject.objects = prepareDrawObjectsList(currentDrawObject.objects);
            }

            if (currentDrawObject.bookable) {
                if (vm.blockedElements && vm.blockedElements.indexOf(currentDrawObject.id) > -1) {
                    currentDrawObject.blocked = true;
                } else if (vm.bookingInformation && vm.bookingInformation[currentDrawObject.id]) {
                    currentDrawObject.status = vm.bookingInformation[currentDrawObject.id].rsvp.status;
                    currentDrawObject.clickable = vm.clickable;
                    currentDrawObject.selectable = false;
                } else {
                    currentDrawObject.status = 'unbooked';
                    currentDrawObject.clickable = vm.clickable;
                    currentDrawObject.selectable = vm.clickable;
                }
            } else {
                currentDrawObject.clickable = false;
                currentDrawObject.selectable = false;
            }
        }

        return drawObjectList;
    }

    function startLoading() {
        vm.showCanvas = false;
        vm.showError = false;
        vm.loading = true;
    }

    function stopLoading() {
        vm.loading = false;
    }

    function showError(message) {
        vm.showCanvas = false;
        stopLoading();
        vm.error = message;
        vm.showError = true;
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
}