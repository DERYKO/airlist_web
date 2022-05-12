import './filter-preset-modal-controller';

/**
 * @ngdoc service
 * @name presets.factory:Ticket
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .factory('FilterPresets', [
        'locale',
        'Resource',
        FilterPresets
    ]);

function FilterPresets(locale, Resource) {
    var $model = Resource.make('presets');

    $model.title = ' Filter Preset';

    $model.locales = ['presets'];

    locale.ready($model.locales).then(function () {
        $model.schema = {
            type: 'object',
            title: locale.getString('presets.title_details'),
            properties: {
                name: {
                    title: locale.getString('presets.name'),
                    type: 'string'
                },
                table: {
                    title: locale.getString('presets.table'),
                    type: 'string',
                    listview: 'hidden'
                },
                description: {
                    title: locale.getString('presets.description'),
                    type: 'string',
                    listview: 'hidden'
                },
                presets: {
                    title: locale.getString('presets.presets'),
                    listview: 'hidden'
                }
            },
            required: ['name', 'presets']
        };
    });

    $model.form = [
        'name',
        'description'
    ];

    return $model;
}


