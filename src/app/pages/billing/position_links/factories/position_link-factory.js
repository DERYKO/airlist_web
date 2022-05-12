/**
 * @ngdoc service
 * @name billing.position_links.factory:PositionLink
 *
 * @description
 *
 */
angular
    .module('airlst.billing.position_links')
    .factory('PositionLink', [
        'locale',
        'Resource',
        PositionLink
    ]);

function PositionLink(locale, Resource) {
    var $model = Resource.make('billing/positions/links');
    $model.title = 'Position Categories';

    locale.ready(['billing']).then(function () {
        $model.schema = {
            type: 'object',
            title: locale.getString('billing.position_links.title'),
            properties: {
                id: {
                    title: locale.getString('billing.position_links.fields.id'),
                    type: 'number',
                    listview: 'hidden',
                    mergeable: false
                },
                label: {
                    title: locale.getString('billing.position_links.fields.label'),
                    type: 'string',
                    columnDef: {}
                },
                description: {
                    title: locale.getString('billing.position_links.fields.description'),
                    type: 'string',
                    columnDef: {}
                },
                price_per_unit: {
                    title: locale.getString('billing.position_links.fields.price_per_unit'),
                    type: 'string',
                    columnDef: {}
                },
                unit: {
                    title: locale.getString('billing.position_links.fields.unit'),
                    type: 'string',
                    columnDef: {}
                },
                amount: {
                    title: locale.getString('billing.position_links.fields.amount'),
                    type: 'number',
                    columnDef: {}
                }
            }
        };
    });


    $model.form = [
        'title'
    ];

    return $model;
}