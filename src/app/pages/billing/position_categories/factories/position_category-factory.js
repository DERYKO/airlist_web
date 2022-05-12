/**
 * @ngdoc service
 * @name billing.position_categories.factory:PositionCategorys
 *
 * @description
 *
 */
angular
    .module('airlst.billing.position_categories')
    .factory('PositionCategory', [
        'locale',
        'Resource',
        PositionCategory
    ]);

function PositionCategory(locale, Resource) {
    var $model = Resource.make('billing/positions/categories');
    $model.title = 'Position Categories';

    locale.ready(['billing']).then(function () {
        $model.schema = {
            type: 'object',
            title: locale.getString('billing.position_categories.title'),
            properties: {
                id: {
                    title: locale.getString('billing.position_categories.fields.id'),
                    type: 'number',
                    listview: 'hidden',
                    mergeable: false
                },
                title: {
                    title: locale.getString('billing.position_categories.fields.title'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                }
            }
        };
    });


    $model.form = [
        'title'
    ];

    return $model;
}