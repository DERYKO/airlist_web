/**
 * @ngdoc service
 * @name seatplans.factory:SeatplanElement
 *
 * @description
 *
 */
angular
    .module('airlst.seatplans')
    .factory('SeatplanElement', [
        'locale',
        'Resource',
        SeatplanElement
    ]);

function SeatplanElement(locale, Resource) {
    var $model = Resource.make('seatplans');

    $model.locales = ['common', 'seatplans'];
    $model.schema = locale.ready($model.locales).then(function () {
        var schema = {
            type: 'object',
            title: locale.getString('seatplans.title_details'),
            properties: {
                title: {
                    title: locale.getString('seatplans.seatplans.fields.title'),
                    type: 'string',
                    columnDef: {
                        column_size: 'size-large',
                        main: true
                    }
                }
            },
            required: ['title']
        };

        return schema;
    });

    return $model;
}