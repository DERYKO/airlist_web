/**
 * @ngdoc service
 * @name billing.positions.factory:Positions
 *
 * @description
 *
 */
angular
    .module('airlst.billing.positions')
    .factory('Position', [
        'locale',
        'Resource',
        Position
    ]);

function Position(locale, Resource) {
    var $model = Resource.make('billing/positions');
    $model.title = 'Position ';

    locale.ready(['billing']).then(function () {
        $model.schema = {
            type: 'object',
            title: locale.getString('billing.positions.title'),
            properties: {
                id: {
                    title: locale.getString('billing.positions.fields.id'),
                    type: 'number',
                    listview: 'hidden',
                    mergeable: false
                },
                title: {
                    title: locale.getString('billing.positions.fields.title'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                category_id: {
                    title: locale.getString('billing.positions.fields.category_id'),
                    type: 'integer',
                    columnDef: {}
                },
                label: {
                    title: locale.getString('billing.positions.fields.label'),
                    type: 'string',
                    columnDef: {}
                },
                description: {
                    title: locale.getString('billing.positions.fields.description'),
                    type: 'string',
                    columnDef: {}
                },
                unit: {
                    title: locale.getString('billing.positions.fields.unit'),
                    type: 'string',
                    columnDef: {}
                },
                price_per_unit: {
                    title: locale.getString('billing.positions.fields.price_per_unit'),
                    type: 'number',
                    columnDef: {}
                }
            }
        };
    });


    $model.form = [
        'title',
        'label',
        'description',
        'unit',
        'price_per_unit'
    ];

    return $model;
}