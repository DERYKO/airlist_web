/**
 * @ngdoc service
 * @name picklists.factory:Picklist
 *
 * @description
 *
 */
angular
    .module('airlst.seatplans')
    .factory('SeatplanGroup', [
        'locale',
        'Resource',
        SeatplanGroup
    ]);

function SeatplanGroup(locale, Resource) {
    var $model = Resource.make('seatplans/groups');

    $model.locales = ['common', 'seatplans'];
    $model.schema = locale.ready($model.locales).then(function () {
        return {
            type: 'object',
            title: locale.getString('seatplans.groups.title'),
            properties: {
                id: {
                    title: locale.getString('common.id'),
                    type: 'number',
                    listview: 'hidden',
                    mergeable: false
                },
                title: {
                    title: locale.getString('seatplans.groups.fields.title'),
                    type: 'string',
                    columnDef: {
                        column_size: 'size-large',
                        main: true
                    }
                },
                grid_width: {
                    title: locale.getString('seatplans.groups.fields.grid_width'),
                    type: 'number',
                    listview: 'hidden',
                    mergeable: false
                },
                grid_height: {
                    title: locale.getString('seatplans.groups.fields.grid_height'),
                    type: 'number',
                    listview: 'hidden',
                    mergeable: false
                },
                style_information: {
                    type: 'object',
                    title: locale.getString('seatplans.groups.fields.style_information.self'),
                    properties: {
                        background: {
                            title: locale.getString('seatplans.groups.fields.style_information.background'),
                            type: 'number',
                            listview: 'hidden',
                            mergeable: false
                        }
                    }
                }
            },
            required: ['title']
        };
    });

    return $model;
}