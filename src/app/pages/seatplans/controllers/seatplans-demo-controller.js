/**
 * @ngdoc object
 * @name users.controller:UsersCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.seatplans')
    .controller('SeatplansDemoCtrl', [
        'Restangular',
        SeatplansDemoCtrl
    ]);

function SeatplansDemoCtrl(Restangular) {
    var vm = this,
        canvas = angular.element('canvas'),
        drawing,
        curId = 0,
        demoSeatplan = {
            grid_width: 200,
            grid_height: 100,
            background: '#fcfcfc',
            font: {
                family: 'Verdana',
                max_size: 12,
                color: '#444'
            },
            defaults: {
                backgrounds: {
                    bookable: {
                        booked: "#FA8072",
                        pending: '#ffffcc',
                        unbooked: '#ccff99'
                    },
                    default: '#99ccff'
                },
                backgrounds_hover: {
                    bookable: {
                        booked: "#ff3300",
                        pending: '#ffff00',
                        unbooked: '#00ff00'
                    },
                    default: '#00ccff',
                }
            },
            objects: [
                {
                    id: 'marstallbox',
                    label: 'Marstall-Box',
                    type: 'rectangle',
                    bookable: false,
                    font: {
                        max_size: 12,
                        color: '#aaa'
                    },
                    pos: {
                        x: 5,
                        y: 5
                    },
                    size: {
                        x: 79,
                        y: 36
                    },
                    objects: [
                        {
                            id: ++curId,
                            type: 'rectangle',
                            labels: {
                                horizontal: {
                                    top: {
                                        text: 303
                                    },
                                    center: {
                                        text: 'Mami',
                                        font: {
                                            family: 'Times'
                                        }
                                    },
                                    bottom: {
                                        text: 1235 + 'g'
                                    }
                                },
                                vertical: {
                                    left: {
                                        text: 'Schänke left'
                                    },
                                    center: {
                                        text: 'ggSchänke centergg'
                                    },
                                    right: {
                                        text: 'Schänke right'
                                    }
                                }
                            },
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 7,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 304,
                            booking_id: 1277,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 18,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 305,
                            booking_id: 1278,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 29,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 305,
                            booking_id: 1278,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 40,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 306,
                            booking_id: 1278,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 51,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 307,
                            booking_id: 1278,
                            clickable: true,
                            bookable: true,
                            status: 'unbooked',
                            pos: {
                                x: 62,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 308,
                            booking_id: 1278,
                            clickable: true,
                            bookable: true,
                            status: 'pending',
                            pos: {
                                x: 73,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 310,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 7,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 312,
                            booking_id: 1278,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 29,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 313,
                            booking_id: 1278,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 40,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 314,
                            booking_id: 1278,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 51,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 315,
                            booking_id: 1278,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 62,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 316,
                            booking_id: 1278,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 73,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            type: 'rectangle',
                            id: 'spacer-1',
                            bookable: false,
                            clickable: false,
                            background: '#99ccff',
                            background_hover: '#99ccff',
                            pos: {
                                x: 16,
                                y: 41 - (0.5 * (2 / 3))
                            },
                            size: {
                                x: 13,
                                y: 0.75
                            }
                        }
                    ],
                    background: '#99ccff',
                    background_hover: '#99ccff',
                    border: {
                        color: '#ccc',
                        width: 0.5
                    }
                },
                {
                    id: ++curId,
                    labels: {
                        vertical: {
                            center: {
                                text: 'Schänke 2'
                            }
                        }
                    },
                    type: 'rectangle',
                    bookable: false,
                    clickable: false,
                    pos: {
                        x: 86,
                        y: 5
                    },
                    font: {
                        max_size: 20
                    },
                    size: {
                        x: 19,
                        y: 36
                    },
                    border: {
                        color: '#ccc',
                        width: 0.5
                    },
                    background: '#99ccff',
                    background_hover: '#99ccff'
                },
                {
                    id: ++curId,
                    label: 'Test-Box',
                    type: 'rectangle',
                    bookable: false,
                    clickable: false,
                    font: {
                        max_size: 12,
                        color: '#aaa'
                    },
                    pos: {
                        x: 115,
                        y: 5
                    },
                    size: {
                        x: 83,
                        y: 36
                    },
                    objects: [
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 117,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 127,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 137,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 147,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 157,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 167,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 177,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 187,
                                y: 7
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },

                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 117,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 127,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 137,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 147,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 167,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 177,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            id: ++curId,
                            type: 'rectangle',
                            label: 303,
                            booking_id: 1234,
                            clickable: true,
                            bookable: true,
                            status: 'booked',
                            pos: {
                                x: 187,
                                y: 24
                            },
                            size: {
                                x: 9,
                                y: 15
                            }
                        },
                        {
                            type: 'rectangle',
                            id: 'spacer-2',
                            bookable: false,
                            clickable: false,
                            background: '#fcfcfc',
                            background_hover: '#fcfcfc',
                            pos: {
                                x: 156,
                                y: 40
                            },
                            size: {
                                x: 11,
                                y: 2
                            }
                        }
                    ],
                    background: '#fcfcfc',
                    background_hover: '#fcfcfc',
                    border: {
                        color: '#ccc',
                        width: 0.5
                    }
                }
            ]
        };

    function _init() {
        resizeCanvas();
        getApiDrawInfo().then(function (result) {
            result.objects = prepareDrawObjectList(result.objects);
            drawing = new AirlstSeatPlanDrawing(canvas[0], result, {
                click: function (e, clickedTarget) {
                    console.log('clicked: ' + clickedTarget.id);
                },
                dblClick: function (e, clickedTarget) {
                    console.log('dblclicked: ' + clickedTarget.id);
                },
                selectionChange: function (drawElement, selected) {
                    if (selected) {
                        console.log('selected: ' + drawElement.id);
                    } else {
                        console.log('unselected: ' + drawElement.id);
                    }
                    console.log('current selected elements: ', drawing.getSelected());
                },
                unSelectable: function (drawElement) {
                    console.log('unSelectable: ' + drawElement.id);
                }
            });
        }, function (data) {
            alert('error while loading data');
        });
    }

    function resizeCanvas() {
        var newWidth = canvas.parent().width(),
            newHeight = newWidth * (demoSeatplan.grid_height / demoSeatplan.grid_width),
            maxHeight = angular.element(window).height() - 130;

        while (newHeight > maxHeight) {
            newWidth--;
            newHeight = newWidth * (demoSeatplan.grid_height / demoSeatplan.grid_width)
        }

        canvas.attr('width', newWidth);
        canvas.attr('height', newHeight);
        if (drawing) {
            drawing.redraw();
        }
    }

    function getApiDrawInfo() {
        return Restangular.one('/seatplans/groups/1/builder').get();
    }

    function prepareDrawObjectList(drawObjectList) {
        _.forEach(drawObjectList, function (val, key) {
            if (val.bookable) {
                val.status = (val.id % 2 == 0) ? 'unbooked' : 'booked';
                val.clickable = true;
                val.selectable = (val.id % 2 == 0);
            } else {
                val.clickable = false;
            }

            if (val.objects && val.objects.length > 0) {
                val.objects = prepareDrawObjectList(val.objects);
            }
        });
        return drawObjectList;
    }

    angular.element(window).bind('resize', function () {
        resizeCanvas();
    });

    _init(demoSeatplan);
}