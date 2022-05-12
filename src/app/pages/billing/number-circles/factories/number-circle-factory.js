/**
 * @ngdoc service
 * @name billing.number-circles.factory:NumberCircles
 *
 * @description
 *
 */
angular
    .module('airlst.billing.number-circles')
    .factory('NumberCircle', [
        'locale',
        'Resource',
        NumberCircle
    ]);

function NumberCircle(locale, Resource) {
    var $model = Resource.make('billing/number-circles');
    $model.title = 'NumberCircle ';

    locale.ready(['billing']).then(function () {
        $model.schema = {
            type: 'object',
            title: locale.getString('billing.number-circles.title'),
            properties: {
                id: {
                    title: locale.getString('billing.number-circles.fields.id'),
                    type: 'number',
                    listview: 'hidden',
                    mergeable: false
                },
                title: {
                    title: locale.getString('billing.number-circles.fields.title'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                number_template: {
                    title: locale.getString('billing.number-circles.fields.number_template'),
                    type: 'string',
                    columnDef: {}
                },
                start_number: {
                    title: locale.getString('billing.number-circles.fields.start_number'),
                    type: 'string',
                    columnDef: {}
                }
            }
        };
    });


    $model.form = [
        'title',
        'number_template',
        'start_number'
    ];

    return $model;
}