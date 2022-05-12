/**
 * @ngdoc service
 * @name templates.factory:Template
 *
 * @description
 *
 */
angular
    .module('airlst.templates.types')
    .factory('TemplateType', [
        'locale',
        'Resource',
        TemplateType
    ]);

function TemplateType(locale, Resource) {
    var $model = Resource.make('templates/types');

    $model.title = ' Template Types';

    $model.form = [
        'name'
    ];

    $model.locales = ['templates', 'common'];

    $model.schema = locale.ready($model.locales).then(function () {
        return {
            type: 'object',
            title: locale.getString('templates.types.title_details'),
            properties: {
                name: {
                    title: locale.getString('templates.types.name'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
            },
            required: ['name']
        };
    });


    return $model;
}