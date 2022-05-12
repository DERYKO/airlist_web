/**
 * @ngdoc service
 * @name templates.factory:Template
 *
 * @description
 *
 */
angular
    .module('airlst.templates.main')
    .factory('Template', [
        'locale',
        'Resource',
        'Ticket',
        'TemplateType',
        Template
    ]);

function Template(locale, Resource, Ticket, TemplateType) {
    var $model = Resource.make('templates');

    $model.title = ' Templates';

    $model.form = [
        'name',
        'email',
        'sender_name',
        'bcc',
        'subject',
        'ticket_id'
    ];

    $model.locales = ['templates', 'common'];

    $model.schema = locale.ready($model.locales).then(function () {
        return {
            type: 'object',
            title: locale.getString('templates.title_details'),
            properties: {
                name: {
                    title: locale.getString('templates.name'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                email: {
                    title: locale.getString('templates.email'),
                    type: 'string'
                },
                sender_name: {
                    title: locale.getString('templates.sender_name'),
                    type: 'string'
                },
                bcc: {
                    title: locale.getString('templates.bcc'),
                    type: 'string'
                },
                subject: {
                    title: locale.getString('templates.subject'),
                    type: 'string'
                },
                aggregate: {
                    title: 'Messages',
                    field: 'stats.aggregate',
                    columnDef: {
                        column_size: 'size-small',
                        enableFiltering: false,
                        enableSorting: false
                    }
                },
                sent: {
                    title: 'Sent',
                    field: 'stats.sent',
                    columnDef: {
                        column_size: 'size-small',
                        enableFiltering: false,
                        enableSorting: false
                    }
                },
                opened: {
                    title: 'Opened',
                    field: 'stats.opened',
                    columnDef: {
                        column_size: 'size-small',
                        enableFiltering: false,
                        enableSorting: false
                    }
                },
                clicked: {
                    title: 'Clicked',
                    field: 'stats.clicked',
                    columnDef: {
                        column_size: 'size-small',
                        enableFiltering: false,
                        enableSorting: false
                    }
                },
                bounced: {
                    title: 'Bounced',
                    field: 'stats.bounced',
                    columnDef: {
                        column_size: 'size-small',
                        enableFiltering: false,
                        enableSorting: false
                    }
                },
                invalid: {
                    title: 'Invalid',
                    field: 'stats.invalid',
                    columnDef: {
                        column_size: 'size-small',
                        enableFiltering: false,
                        enableSorting: false
                    }
                },
                ticket_id: {
                    title: locale.getString('templates.ticket_id'),
                    listview: 'hidden',
                    type: 'integer',
                    'x-schema-form': {
                        type: 'select-box',
                        valueField: 'id',
                        displayField: 'name',
                        config: {
                            model: Ticket,
                            settings: {}
                        }
                    }
                },
                template_type_id: {
                    title: locale.getString('templates.template_type_id'),
                    listview: 'hidden',
                    type: 'integer',
                    'x-schema-form': {
                        type: 'select-box',
                        valueField: 'id',
                        displayField: 'name',
                        config: {
                            model: TemplateType,
                            settings: {}
                        }
                    }
                },
                html: {
                    title: locale.getString('templates.html'),
                    listview: false,
                    'x-form-schema': {
                        type: 'textarea'
                    }
                }
            },
            required: ['name', 'email', 'subject']
        };
    });
    return $model;
}