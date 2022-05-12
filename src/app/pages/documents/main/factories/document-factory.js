/**
 * @ngdoc service
 * @name documents.templates.factory:DocumentTemplate
 *
 * @description
 *
 */
angular
    .module('airlst.documents.main')
    .factory('Document', [
        'locale',
        'Resource',
        '$http',
        'Env',
        'FileSaver',
        'SweetAlert',
        Document
    ]);

function Document(locale, Resource, $http, Env, FileSaver, SweetAlert) {
    const $model = Resource.make('documents');

    $model.title = ' Documents';

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

    $model.setContactId = setContactId;
    $model.setRsvpId = setRsvpId;
    $model.download = download;

    return $model;

    function copyModelForPath(path) {
        var fieldsToCopy = [
            'title',
            'form',
            'locales',
            'schema'
        ];

        var newModel = Resource.make(path);

        _.forEach(fieldsToCopy, function (field) {
            newModel[field] = $model[field];
        });
        return newModel;
    }

    function setContactId(contactId) {
        return copyModelForPath('contacts/' + contactId + '/documents');
    }

    function setRsvpId(rsvpId) {
        return copyModelForPath('rsvps/' + rsvpId + '/documents');
    }

    function download(document) {
        return $http
            .get(Env.apiUrl + '/documents/' + document.id + '/download', {
                responseType: 'blob',
                ignoreLoadingBar: true
            })
            .then(function (response) {
                return FileSaver.saveAs(new Blob([response.data], {type: response.headers('content-type')}), document.title + '.pdf');
            }, function (response) {
                if (response.data) {
                    SweetAlert.error(response.data.message);
                }
            });
    }
}