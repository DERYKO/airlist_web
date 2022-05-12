/**
 * @ngdoc service
 * @name messages.factory:Message
 *
 * @description
 *
 */
angular
    .module('airlst.messages')
    .factory('Message', [
        'locale',
        'Resource',
        Message
    ]);

function Message(locale, Resource) {
    var $model = Resource.make('messages');

    $model.title = ' Messages';

    $model.locales = ['common', 'messages'];

    $model.schema = locale.ready($model.locales).then(function () {
        return {
            type: 'object',
            title: locale.getString('common.message'),
            properties: {
                send_to: {
                    title: locale.getString('messages.send_to'),
                    type: 'string',
                    export: {
                        group: 'message.details'
                    },
                    columnDef: {
                        main: true,
                        template: function (value, row, col) {
                            return (value != '') ? value : '(No recipient ' + ((row.type == 'sms') ? 'number' : 'email address') + ' available)'
                        }
                    }
                },
                subject: {
                    title: locale.getString('messages.subject'),
                    type: 'string',
                    export: {
                        group: 'message.details'
                    }
                },
                status: {
                    title: locale.getString('messages.status'),
                    type: 'string',
                    export: {
                        group: 'message.details'
                    },
                    enum: [
                        'scheduled',
                        'processed',
                        'delivered',
                        'deferred',
                        'bounced',
                        'opened',
                        'clicked',
                        'error',
                        'dropped'
                    ],
                    'x-schema-form': {
                        titleMap: [
                            {value: 'scheduled', name: 'scheduled'},
                            {value: 'processed', name: 'processed'},
                            {value: 'delivered', name: 'delivered'},
                            {value: 'deferred', name: 'deferred'},
                            {value: 'bounced', name: 'bounced'},
                            {value: 'opened', name: 'opened'},
                            {value: 'clicked', name: 'clicked'},
                            {value: 'error', name: 'error'},
                            {value: 'dropped', name: 'dropped'}
                        ]
                    }
                },
                extended_status_information: {
                    title: locale.getString('messages.extended_status_information'),
                    type: 'string',
                    export: {
                        group: 'message.details'
                    },
                    columnDef: {
                        enableFiltering: false,
                        enableSorting: false
                    }
                },
                created_at: {
                    title: locale.getString('messages.date'),
                    type: 'string',
                    export: {
                        group: 'message.details'
                    },
                    format: 'datetime'
                },
                updated_at: {
                    title: locale.getString('messages.update'),
                    type: 'string',
                    format: 'datetime',
                    listview: 'hidden'
                },
                type: {
                    title: locale.getString('messages.type'),
                    type: 'string',
                    export: {
                        group: 'message.details'
                    },
                    listview: 'hidden',
                    enum: ['sms', 'email'],
                    'x-schema-form': {
                        titleMap: [
                            {value: 'sms', name: 'Sms'},
                            {value: 'email', name: 'Email'}
                        ]
                    }
                },
                content: {
                    title: locale.getString('messages.content'),
                    type: 'string',
                    listview: false
                }
            }
        };
    });

    return $model;
}