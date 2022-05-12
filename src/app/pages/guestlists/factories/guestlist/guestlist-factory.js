

/**
 * @ngdoc service
 * @name guestlists.factory:Guestlist
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('Guestlist', ['Category', 'Contact', 'locale', '$q', 'Resource', 'Restangular', 'SelectBox', 'Template', 'Seatplan', '$uibModal', '$auth', Guestlist]);

function Guestlist(Category, Contact, locale, $q, Resource, Restangular, SelectBox, Template, Seatplan, $uibModal, $auth) {
    var $model = Resource.make('guestlists');

    $model.title = ' Guestlists';

    $model.locales = ['common', 'customs', 'guestlists'];

    $model.schema = locale.ready($model.locales).then(function () {
        return {
            type: 'object',
            title: locale.getString('guestlists.title_details'),
            properties: {
                name: {
                    title: locale.getString('guestlists.name'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                permission: {
                    title: locale.getString('guestlists.permission'),
                    type: 'string',
                    default: 'public',
                    listview: 'hidden',
                    enum: ['private', 'public'],
                    'x-schema-form': {
                        titleMap: [
                            {value: 'private', name: locale.getString('common.private')},
                            {value: 'public', name: locale.getString('common.public')}
                        ]
                    }
                },
                date: {
                    title: locale.getString('guestlists.date'),
                    type: 'string',
                    listview: true,
                    format: 'date',
                    'x-schema-form': {
                        required: true,
                        type: 'datepicker',
                        minDate: new Date(),
                        defaultDate: new Date(),
                        open: false,
                        destroyStrategy: 'null'
                    }
                },
                sum_pax_planned: {
                    title: 'Pax Planned',
                    field: 'sum_pax_planned',
                    columnDef: {
                        column_size: 'size-small',
                        enableFiltering: false,
                        enableSorting: false,
                    }
                },
                sum_pax_actual: {
                    title: 'Pax Checked In',
                    field: 'sum_pax_actual',
                    columnDef: {
                        column_size: 'size-small',
                        enableFiltering: false,
                        enableSorting: false,
                    }
                },
                count_rsvps: {
                    title: 'Amount Bookings',
                    field: 'count_rsvps',
                    columnDef: {
                        column_size: 'size-small',
                        enableFiltering: false,
                        enableSorting: false,
                    }
                },
                customs: {
                    type: "array",
                    maxItems: 40,
                    listview: false,
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                title: "Name",
                                type: "string",
                                default: "Custom Attribute 0"
                            },
                            type: {
                                title: "Type",
                                type: "string",
                                default: "textbox",
                                enum: [
                                    "textbox",
                                    "textarea",
                                    "select",
                                    "decimal",
                                    "integer",
                                    "boolean",
                                    "date"
                                    //"datetime"
                                ]
                            },
                            enum: {
                                title: 'Options',
                                type: 'array',
                                "items": {
                                    "type": "string",
                                    "title": "Option"
                                }
                            }/*,
                                 significant: {
                                 title: 'Number of digits(total)',
                                 type: 'integer',
                                 },
                                 precision: {
                                 title: 'Number of digits(after decimal point)',
                                 type: 'integer',
                                 }*/
                        },
                        required: ["name", "type"]
                    }
                },
                changelog: {
                    title: locale.getString('profile.changelog'),
                    type: 'string',
                    listview: 'hidden'
                },
                code_invited: {
                    title: locale.getString('guestlists.code_invited'),
                    type: 'boolean',
                    listview: false,
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                use_contact_code: {
                    title: locale.getString('guestlists.use_contact_code'),
                    type: 'boolean',
                    listview: false,
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                auto_send: {
                    title: locale.getString('guestlists.auto_send'),
                    type: 'boolean',
                    default: false,
                    listview: 'hidden',
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                open_pax_limit: {
                    title: locale.getString('guestlists.open_pax_limit'),
                    type: 'string',
                    listview: 'hidden'
                },
                code_pax_limit: {
                    title: locale.getString('guestlists.code_pax_limit'),
                    type: 'string',
                    listview: 'hidden'
                },
                open_waitlist: {
                    title: locale.getString('guestlists.open_waitlist'),
                    type: 'string',
                    listview: 'hidden'
                },
                code_waitlist: {
                    title: locale.getString('guestlists.code_waitlist'),
                    type: 'string',
                    listview: 'hidden'
                },
                waitlist_template_id: {
                    title: locale.getString('guestlists.waitlist_template_id'),
                    type: 'integer',
                    listview: 'hidden',
                    'x-schema-form': {
                        type: 'select-box',
                        valueField: 'id',
                        displayField: 'name',
                        config: {
                            model: Template,
                            settings: {}
                        }
                    }
                },
                pending_template_id: {
                    title: locale.getString('guestlists.pending_template_id'),
                    type: 'integer',
                    listview: 'hidden',
                    'x-schema-form': {
                        type: 'select-box',
                        valueField: 'id',
                        displayField: 'name',
                        config: {
                            model: Template,
                            settings: {}
                        }
                    }
                },
                ask_password: {
                    title: locale.getString('guestlists.ask_password'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                password: {
                    title: locale.getString('guestlists.password'),
                    type: 'string',
                    listview: 'hidden'
                },
                unique_emails: {
                    title: locale.getString('guestlists.unique_emails'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                max_registrations_per_email: {
                    title: locale.getString('guestlists.max_registrations_per_email'),
                    type: 'integer',
                    listview: 'hidden',
                    default: 0
                },
                add_to_contacts: {
                    title: locale.getString('guestlists.add_to_contacts'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                update_contact: {
                    title: locale.getString('guestlists.update_contact'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                add_category_to_contact: {
                    title: locale.getString('guestlists.add_category_to_contact'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                add_category: {
                    title: locale.getString('guestlists.add_category'),
                    listview: 'hidden',
                    type: 'integer',
                    'x-schema-form': {
                        type: 'select-box',
                        valueField: 'id',
                        displayField: 'name',
                        config: {
                            model: Category,
                            settings: {}
                        }
                    }
                },
                registration_start: {
                    title: locale.getString('guestlists.registration_start'),
                    type: 'string',
                    listview: 'hidden',
                    format: 'datetime',
                    'x-schema-form': {
                        type: 'datetimepicker',
                        destroyStrategy: 'null',
                        dateOptions: {
                            minDate: new Date(),
                            defaultDate: new Date()
                        }
                    }
                },
                registration_end: {
                    title: locale.getString('guestlists.registration_end'),
                    type: 'string',
                    listview: 'hidden',
                    format: 'datetime',
                    'x-schema-form': {
                        type: 'datetimepicker',
                        destroyStrategy: 'null',
                        dateOptions: {
                            minDate: new Date(),
                            defaultDate: new Date()
                        }
                    }
                },
                response_options: {
                    title: locale.getString('guestlists.response_options'),
                    type: 'string',
                    listview: 'hidden',
                    enum: [
                        'confirm',
                        'cancel',
                        'confirm_and_cancel'
                    ],
                    'x-schema-form': {
                        titleMap: [
                            {value: 'confirm', name: locale.getString('guestlists.confirm_only')},
                            {value: 'cancel', name: locale.getString('guestlists.cancel_only')},
                            {value: 'confirm_and_cancel', name: locale.getString('guestlists.confirm_and_cancel')}
                        ]
                    }
                },
                pax_required: {
                    title: locale.getString('guestlists.pax_required'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                pax_planned_max: {
                    title: locale.getString('guestlists.pax_planned_max'),
                    type: 'string',
                    listview: 'hidden'
                },
                guests_individual: {
                    title: locale.getString('guestlists.guests_individual'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                just_communicate_main: {
                    title: locale.getString('guestlists.just_communicate_main'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                fields: {
                    type: "array",
                    listview: false,
                    title: 'guestslist.fields',
                    default: [],
                    startEmpty: true,
                    items: {
                        type: "object",
                        properties: {
                            slug: {
                                title: "Field",
                                type: "string",
                                'x-schema-form': {
                                    type: 'select',
                                    titleMap: []
                                }
                            },
                            require: {
                                title: locale.getString('common.required'),
                                type: 'boolean',
                                listview: 'hidden',
                                default: false,
                                enum: [1, 0],
                                'x-schema-form': {
                                    type: 'boolean',
                                    style: {
                                        selected: 'btn-success',
                                        unselected: 'btn-default'
                                    },
                                    titleMap: [
                                        {value: true, name: locale.getString('common.yes')},
                                        {value: false, name: locale.getString('common.no')}
                                    ]
                                }
                            },
                            auto_fill: {
                                title: locale.getString('guestlists.auto_fill'),
                                type: 'boolean',
                                listview: 'hidden',
                                default: true,
                                enum: [1, 0],
                                'x-schema-form': {
                                    type: 'boolean',
                                    style: {
                                        selected: 'btn-success',
                                        unselected: 'btn-default'
                                    },
                                    titleMap: [
                                        {value: true, name: locale.getString('common.yes')},
                                        {value: false, name: locale.getString('common.no')}
                                    ]
                                }
                            }
                        }
                    }
                },
                fields_guest: {
                    type: "array",
                    title: 'guestslist.fields_guest',
                    listview: false,
                    default: [],
                    startEmpty: true,
                    items: {
                        type: "object",
                        properties: {
                            slug: {
                                title: "Field",
                                type: "string",
                                'x-schema-form': {
                                    type: 'select',
                                    titleMap: []
                                }
                            },
                            require: {
                                title: locale.getString('common.required'),
                                type: 'boolean',
                                listview: 'hidden',
                                default: false,
                                enum: [1, 0],
                                'x-schema-form': {
                                    type: 'boolean',
                                    style: {
                                        selected: 'btn-success',
                                        unselected: 'btn-default'
                                    },
                                    titleMap: [
                                        {value: true, name: locale.getString('common.yes')},
                                        {value: false, name: locale.getString('common.no')}
                                    ]
                                }
                            }
                        }
                    }
                },
                send_confirmation: {
                    title: locale.getString('guestlists.send_confirmation'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                confirmation_template_id: {
                    title: locale.getString('guestlists.confirmation_template_id'),
                    type: 'integer',
                    listview: 'hidden',
                    'x-schema-form': {
                        type: 'select-box',
                        valueField: 'id',
                        displayField: 'name',
                        config: {
                            model: Template,
                            settings: {}
                        }
                    }
                },
                send_cancellation: {
                    title: locale.getString('guestlists.send_cancellation'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                cancellation_template_id: {
                    title: locale.getString('guestlists.cancellation_template_id'),
                    type: 'integer',
                    listview: 'hidden',
                    'x-schema-form': {
                        type: 'select-box',
                        valueField: 'id',
                        displayField: 'name',
                        config: {
                            model: Template,
                            settings: {}
                        }
                    }
                },
                send_request_email: {
                    title: locale.getString('guestlists.send_request_email'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                request_email_id: {
                    title: locale.getString('guestlists.request_email_id'),
                    type: 'integer',
                    listview: 'hidden',
                    'x-schema-form': {
                        type: 'select-box',
                        valueField: 'id',
                        displayField: 'name',
                        config: {
                            model: Template,
                            settings: {}
                        }
                    }
                },
                send_email_only_to_parent: {
                    title: locale.getString('guestlists.send_email_only_to_parent'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                auto_accept_request: {
                    title: locale.getString('guestlists.auto_accept_request'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: locale.getString('common.yes')},
                            {value: false, name: locale.getString('common.no')}
                        ]
                    }
                },
                external_reg_template_id: {
                    title: locale.getString('guestlists.external_reg_template_id'),
                    type: 'integer',
                    listview: 'hidden',
                    'x-schema-form': {
                        type: 'select-box',
                        valueField: 'id',
                        displayField: 'name',
                        config: {
                            model: Template,
                            settings: {}
                        }
                    }
                },
                text_1: {
                    title: locale.getString('guestlists.text_1'),
                    type: 'string',
                    listview: false
                },
                text_2: {
                    title: locale.getString('guestlists.text_2'),
                    type: 'string',
                    listview: false
                },
                text_3: {
                    title: locale.getString('guestlists.text_3'),
                    type: 'string',
                    listview: false
                },
                text_4: {
                    title: locale.getString('guestlists.text_4'),
                    type: 'string',
                    listview: false
                },
                text_5: {
                    title: locale.getString('guestlists.text_5'),
                    type: 'string',
                    listview: false
                },
                image_1: {
                    title: locale.getString('guestlists.image_1'),
                    columnDef: {
                        width: 45,
                        enableFiltering: false,
                        enableSorting: false,
                        template: '<img class="img-responsive grid-image" src="$$value$$"/>'
                    },
                    type: 'string',
                    listview: 'hidden',
                    format: 'image',
                    'x-schema-form': {
                        text: true, //Allow text input
                        uploader: true,
                        type: 'imageuploader',
                        class: 'profile-userpic-large',
                        preview: true
                    }
                },
                image_2: {
                    title: locale.getString('guestlists.image_2'),
                    columnDef: {
                        width: 45,
                        enableFiltering: false,
                        enableSorting: false,
                        template: '<img class="img-responsive grid-image" src="$$value$$"/>'
                    },
                    type: 'string',
                    listview: 'hidden',
                    format: 'image',
                    'x-schema-form': {
                        text: true, //Allow text input
                        uploader: true,
                        type: 'imageuploader',
                        class: 'profile-userpic-large',
                        preview: true
                    }
                },
                image_3: {
                    title: locale.getString('guestlists.image_3'),
                    columnDef: {
                        width: 45,
                        enableFiltering: false,
                        enableSorting: false,
                        template: '<img class="img-responsive grid-image" src="$$value$$"/>'
                    },
                    type: 'string',
                    listview: 'hidden',
                    format: 'image',
                    'x-schema-form': {
                        text: true, //Allow text input
                        uploader: true,
                        type: 'imageuploader',
                        class: 'profile-userpic-large',
                        preview: true
                    }
                }

            },
            enable_seatplan: {
                title: locale.getString('guestlists.enable_seatplan'),
                type: 'boolean',
                listview: 'hidden',
                default: false,
                enum: [1, 0],
                'x-schema-form': {
                    titleMap: [
                        {value: true, name: locale.getString('common.yes')},
                        {value: false, name: locale.getString('common.no')}
                    ]
                }
            },
            seatplan_id: {
                title: locale.getString('guestlists.seatplan_id'),
                type: 'integer',
                listview: 'hidden',
                'x-schema-form': {
                    type: 'select-box',
                    valueField: 'id',
                    displayField: 'name',
                    config: {
                        model: Seatplan,
                        settings: {}
                    }
                }
            },
            allow_multiple_rsvps_per_contact: {
                title: locale.getString('guestlists.allow_multiple_rsvps_per_contact'),
                type: 'boolean',
                listview: 'hidden',
                default: false,
                enum: [1, 0],
                'x-schema-form': {
                    titleMap: [
                        {value: true, name: locale.getString('common.yes')},
                        {value: false, name: locale.getString('common.no')}
                    ]
                }
            },
            required: ['name', 'date']
        };
    });

    $model.addToGuestlist = addToGuestlist;
    $model.addTemplatesToGuestlist = addTemplatesToGuestlist;
    $model.removeTemplatesFromGuestlist = removeTemplatesFromGuestlist;

    init();

    function init() {
        Contact.getFields().then(function (fields) {
            $model.schema.then(function (schema) {
                _.forEach(fields, function (field) {
                    schema.properties.fields.items.properties.slug['x-schema-form'].titleMap.push({
                        value: field.slug,
                        name: !_.isUndefined(field.title) && field.title && field.title.length > 0 ? field.title : field.slug
                    });
                    schema.properties.fields_guest.items.properties.slug['x-schema-form'].titleMap.push({
                        value: field.slug,
                        name: !_.isUndefined(field.title) && field.title && field.title.length > 0 ? field.title : field.slug
                    });
                });
            });
        });
        $model.schema.then(function (schema) {
            return $auth.getUser().then(function (user) {
                var customTabItems = [];
                for (var i = 1; i <= 30; i++) {
                    var attr = user.company.data['custom_' + i + '_guestlist'];

                    if (attr !== null && attr.length > 0 || _.keys(attr).length > 0) {
                        schema.properties['custom_' + i] = {
                            original: attr,
                            title: attr.name,
                            type: attr.type,
                            listview: 'hidden',
                            export: {
                                group: 'contacts.custom-group'
                            }
                        };

                        if (attr.type == 'textbox') {
                            schema.properties['custom_' + i]['type'] = 'string';
                        }

                        if (attr.type == 'decimal') {
                            schema.properties['custom_' + i]['type'] = 'number';
                            schema.properties['custom_' + i]['x-schema-form'] = {
                                'string-to-number': true
                            }
                        }

                        if (attr.type == 'select') {
                            schema.properties['custom_' + i]['type'] = 'string';
                            schema.properties['custom_' + i]['enum'] = attr.enum;
                            schema.properties['custom_' + i]['x-schema-form'] = {
                                type: 'select',
                                titleMap: _(attr.enum).filter(function (option) {
                                    return !_.isNull(option);
                                }).map(function (option) {
                                    return {value: option, name: option};
                                }).value()
                            }
                        }

                        if (attr.type == 'textarea') {
                            schema.properties['custom_' + i]['type'] = 'string';

                        }

                        if (attr.type == 'boolean') {
                            schema.properties['custom_' + i]['type'] = 'boolean';
                            schema.properties['custom_' + i]['enum'] = ['yes', 'no'];
                        }

                        if (attr.type == 'date') {
                            schema.properties['custom_' + i]['type'] = 'string';
                            schema.properties['custom_' + i]['format'] = 'date';
                        }

                        if (attr.type === 'media_image' || attr.type === 'media_file') {
                            schema.properties['custom_' + i]['original'].startDirectory = 'guestlists';
                        }

                        customTabItems[i] = 'custom_' + i;
                    }

                }

                return schema;
            });
        });
    }

    function addToGuestlist(contacts, manager) {
        return SelectBox.get({
            model: $model,
            filters: {perm: 'write'},
            settings: {
                addNew: false
            }
        }).then(function (guestlist) {
            return addRSVPModal(guestlist, contacts, manager);
        }, function (response) {
            return $q.reject(response);
        });
    }

    function addTemplatesToGuestlist(guestlist, templates) {
        return Restangular.one('guestlists/' + guestlist.id + '/templates').doPUT({
            templates: templates
        });
    }

    function removeTemplatesFromGuestlist(guestlist, template) {
        return Restangular.one('guestlists/', guestlist.id).customOperation('remove', 'templates', null, {'Content-Type': 'application/json'}, {templates: [template]});
    }

    function addRSVPModal(guestlist, contacts, manager) {
        var $modalInstance = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'guestlists/views/rsvps-editor.tpl.html',
            controller: 'RsvpCreateCtrl',
            controllerAs: 'vm',
            resolve: {
                guestlist: function () {
                    return guestlist
                },
                manager: function () {
                    return manager;
                },
                contacts: function () {
                    return contacts;
                }
            }
        });

        return $modalInstance.result.then(function () {
            //Rsvp booking made successfully
        }, function (response) {
            return $q.reject(response);
        });

    }

    $model.getCustom = function (model) {
        model.customs = [];
        for (var i = 0; i < 40; i++) {
            var value = model['custom_' + (i + 1) + '_name'];
            if (!_.isUndefined(value) && value && ( value.length > 0 || _.keys(value).length > 0)) {
                if (_.has(value, 'name'))
                    model.customs[i] = value;
            } else {
                model['custom_' + (i + 1) + '_name'] = null;
            }
        }
    };

    $model.setCustom = function (model) {
        model.customs.forEach(function (custom, index) {
            if (custom.name !== 'Custom Attribute 0' && _.keys(custom).length > 0)
                model['custom_' + (index + 1) + '_name'] = custom;
        });
        if (model.customs.length < 40) {
            var len = model.customs.length + 1;
            for (len; len < 41; len++) {
                model['custom_' + (len ) + '_name'] = {};
            }
        }
    };

    return $model;
}
