/**
 * @ngdoc service
 * @name documents.templates.factory:DocumentTemplate
 *
 * @description
 *
 */
angular
    .module('airlst.documents.templates')
    .factory('DocumentTemplate', [
        'locale',
        'Resource',
        Template
    ]);

function Template(locale, Resource) {
    var $model = Resource.make('documents/templates');

    $model.title = ' Document Templates';

    $model.form = [
        'title',
        'content'
    ];

    $model.locales = ['documents', 'common'];

    $model.schema = locale.ready($model.locales).then(function () {
        return {
            type: 'object',
            title: locale.getString('documents.templates.title'),
            properties: {
                title: {
                    title: locale.getString('documents.templates.fields.title.title'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                template: {
                    title: locale.getString('documents.templates.fields.template.title'),
                    listview: false,
                    'x-form-schema': {
                        type: 'textarea'
                    }
                },
                created_at: {
                    title: locale.getString('documents.templates.fields.created_at.title'),
                    type: 'string',
                    format: 'datetime',
                    listview: 'hidden'
                },
                updated_at: {
                    title: locale.getString('documents.templates.fields.updated_at.title'),
                    type: 'string',
                    format: 'datetime',
                    listview: 'hidden'
                }
            },
            required: ['title', 'template']
        };
    });


    return $model;
}