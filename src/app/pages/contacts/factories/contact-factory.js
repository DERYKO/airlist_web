

/**
 * @ngdoc service
 * @name contacts.factory:Contact
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('Contact', [
        '$auth',
        'Env',
        '$http',
        'locale',
        'Resource',
        'Restangular',
        '$rootScope',
        Contact
    ]);

function Contact($auth, Env, $http, locale, Resource, Restangular, $rootScope) {

    var $model = Resource.make('contacts');

    $model.title = ' Contacts';

    $model.getSchema = function () {

        return locale.ready(['contacts', 'profile']).then(function () {

            return $auth.getUser().then(function (user) {

                var schema = {
                    type: 'object',
                    title: locale.getString('common.contact'),
                    properties: {
                        id: {
                            title: locale.getString('common.id'),
                            type: 'number',
                            listview: 'hidden',
                            mergeable: false
                        },
                        profile_image: {
                            title: locale.getString('profile.profile_image'),
                            columnDef: {
                                column_size: 'size-profile-image',
                                width: 45,
                                enableFiltering: false,
                                enableSorting: false,
                                displayName: ' ',
                                template: '<img class="img-responsive grid-image" ng-src="{{row.profile_image.url}}"/>'
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
                        delete_image: {
                            title: locale.getString('common.delete_image'),
                            listview: false,
                            type: 'boolean',
                            default: false
                        },
                        full_name: {
                            title: locale.getString('profile.full_name'),
                            column_size: 'size-large',
                            type: 'string',
                            columnDef: {
                                main: true,
                                template: '{{row.full_name || "No name"}}',
                                search_text: 'Name Search'
                            }
                        },
                        first_name: {
                            title: locale.getString('profile.first_name'),
                            column_size: 'size-medium',
                            export: {
                                group: 'contacts.preferred-address'
                            },
                            type: 'string',
                            listview: 'hidden'
                        },
                        last_name: {
                            title: locale.getString('profile.last_name'),
                            column_size: 'size-medium',
                            type: 'string',
                            export: {
                                group: 'contacts.preferred-address'
                            },
                            listview: 'hidden',
                            columnDef: {
                                sort: {
                                    priority: 1
                                }
                            }
                        },
                        foreign_id: {
                            title: locale.getString('profile.foreign_id'),
                            type: 'string',
                            listview: false
                        },
                        nfc_key: {
                            title: locale.getString('profile.nfc_key'),
                            type: 'string',
                            listview: 'hidden'
                        },
                        code: {
                            title: 'Contact Code',
                            field: 'code',
                            type: 'string',
                            listview: 'hidden'
                        },
                        addressbook: {
                            title: locale.getString('profile.addressbook'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0],
                            columnDef: {
                                display_name: 'Listed'
                            }
                        },
                        restricted: {
                            title: locale.getString('profile.restricted'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        unmerged_flag: {
                            title: locale.getString('profile.unmerged_flag'),
                            type: 'boolean',
                            listview: false,
                            enum: [1, 0]
                        },
                        title: {
                            title: locale.getString('profile.title'),
                            type: 'string',
                            listview: 'hidden',
                            export: {
                                group: 'contacts.preferred-address'
                            }
                        },
                        salutation: {
                            title: locale.getString('profile.salutation'),
                            type: 'string',
                            listview: 'hidden',
                            export: {
                                group: 'contacts.formalities'
                            }
                        },
                        salutation_type: {
                            title: locale.getString('profile.salutation_type'),
                            type: 'string',
                            listview: 'hidden',
                            export: {
                                group: 'contacts.formalities'
                            },
                            enum: ['formal', 'colloquial'],
                            'x-schema-form': {
                                type: 'select',
                                titleMap: [
                                    { value: 'formal', name: 'Formal' },
                                    { value: 'colloquial', name: 'Colloquial' }
                                ]
                            }
                        },
                        sex: {
                            title: locale.getString('profile.sex'),
                            type: 'string',
                            listview: 'hidden',
                            export: {
                                group: 'contacts.formalities'
                            },
                            enum: ['various', 'male', 'female', 'unknown'],
                            titleMap: [
                                { value: 'male', name: 'Herr' },
                                { value: 'various', name: 'Various' },
                                { value: 'female', name: 'Frau' },
                                { value: 'unknown', name: 'Unknown' }
                            ]
                        },
                        age: {
                            title: 'Age',
                            type: 'string',
                            listview: 'hidden',
                            export: {
                                group: 'contacts.formalities'
                            }
                        },
                        language: {
                            title: locale.getString('profile.language'),
                            type: 'string',
                            listview: 'hidden',
                            export: {
                                group: 'contacts.formalities'
                            }
                        },
                        company_name: {
                            title: locale.getString('profile.company_name'),
                            type: 'string',
                            export: {
                                group: 'contacts.company'
                            },
                            listview: true
                        },
                        position: {
                            title: locale.getString('profile.position'),
                            type: 'string',
                            export: {
                                group: 'contacts.company'
                            },
                            listview: 'hidden'
                        },
                        department: {
                            title: locale.getString('profile.department'),
                            type: 'string',
                            export: {
                                group: 'contacts.company'
                            },
                            listview: 'hidden'
                        },
                        street: {
                            title: locale.getString('profile.street'),
                            type: 'string',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            listview: 'hidden'
                        },
                        street_2: {
                            title: locale.getString('profile.street_2'),
                            type: 'string',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            listview: 'hidden'
                        },
                        zip: {
                            title: locale.getString('profile.zip'),
                            type: 'string',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            listview: 'hidden'
                        },
                        city: {
                            title: locale.getString('profile.city'),
                            type: 'string',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            listview: 'hidden'
                        },
                        country: {
                            title: locale.getString('profile.country'),
                            type: 'string',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            listview: 'hidden',
                            enum: (function ($rootScope) {
                                var countryCodes = [];

                                _.forEach($rootScope.deposit.countries, function (val) {
                                    countryCodes.push(val.code);
                                });

                                return countryCodes;
                            })($rootScope),
                            'x-schema-form': {
                                type: 'select',
                                titleMap: (function ($rootScope) {
                                    var countryCodes = [];

                                    _.forEach($rootScope.deposit.countries, function (val) {
                                        countryCodes.push({
                                            value: val.code,
                                            name: val.name
                                        });
                                    });

                                    return countryCodes;
                                })($rootScope)
                            }
                        },
                        email: {
                            title: locale.getString('profile.email'),
                            type: 'string',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            columnDef: {
                                width: 125
                            }
                        },
                        email_cc: {
                            title: locale.getString('profile.email_cc'),
                            type: 'string',
                            listview: 'hidden',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            columnDef: {
                                width: 125
                            }
                        },
                        phone: {
                            title: locale.getString('profile.phone'),
                            type: 'string',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            listview: 'hidden'
                        },
                        phone_2: {
                            title: locale.getString('profile.phone_2'),
                            type: 'string',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            listview: 'hidden'
                        },
                        fax: {
                            title: locale.getString('profile.fax'),
                            type: 'string',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            listview: 'hidden'
                        },
                        web: {
                            title: locale.getString('contacts.web'),
                            type: 'string',
                            export: {
                                group: 'contacts.personal-address'
                            },
                            listview: 'hidden'
                        },
                        facebook_url: {
                            title: locale.getString('contacts.facebook_url'),
                            type: 'string',
                            export: {
                                group: 'contacts.social-media'
                            },
                            listview: 'hidden'
                        },
                        instagram_url: {
                            title: locale.getString('contacts.instagram_url'),
                            type: 'string',
                            export: {
                                group: 'contacts.social-media'
                            },
                            listview: 'hidden'
                        },
                        linkedin_url: {
                            title: locale.getString('contacts.linkedin_url'),
                            type: 'string',
                            export: {
                                group: 'contacts.social-media'
                            },
                            listview: 'hidden'
                        },
                        xing_url: {
                            title: locale.getString('contacts.xing_url'),
                            type: 'string',
                            export: {
                                group: 'contacts.social-media'
                            },
                            listview: 'hidden'
                        },
                        business_preferred: {
                            title: locale.getString('contacts.business_preferred'),
                            type: 'boolean',
                            default: false,
                            listview: 'hidden',
                            enum: [1, 0],
                            export: {
                                group: 'contacts.business-address'
                            },
                            columnDef: {
                                display_name: 'Listed'
                            }
                        },
                        business_street: {
                            title: locale.getString('contacts.business_street'),
                            type: 'string',
                            export: {
                                group: 'contacts.business-address'
                            },
                            listview: 'hidden'
                        },
                        business_street_2: {
                            title: locale.getString('contacts.business_street_2'),
                            type: 'string',
                            export: {
                                group: 'contacts.business-address'
                            },
                            listview: 'hidden'
                        },
                        business_zip: {
                            title: locale.getString('contacts.business_zip'),
                            type: 'string',
                            export: {
                                group: 'contacts.business-address'
                            },
                            listview: 'hidden'
                        },
                        business_city: {
                            title: locale.getString('contacts.business_city'),
                            type: 'string',
                            export: {
                                group: 'contacts.business-address'
                            },
                            listview: 'hidden'
                        },
                        business_country: {
                            title: locale.getString('contacts.business_country'),
                            type: 'string',
                            export: {
                                group: 'contacts.business-address'
                            },
                            listview: 'hidden',
                            enum: (function ($rootScope) {
                                var countryCodes = [];

                                _.forEach($rootScope.deposit.countries, function (val) {
                                    countryCodes.push(val.code);
                                });

                                return countryCodes;
                            })($rootScope),
                            'x-schema-form': {
                                type: 'select',
                                titleMap: (function ($rootScope) {
                                    var countryCodes = [];

                                    _.forEach($rootScope.deposit.countries, function (val) {
                                        countryCodes.push({
                                            value: val.code,
                                            name: val.name
                                        });
                                    });

                                    return countryCodes;
                                })($rootScope)
                            }
                        },
                        business_email: {
                            title: locale.getString('contacts.business_email'),
                            type: 'string',
                            export: {
                                group: 'contacts.business-address'
                            }
                        },
                        business_phone: {
                            title: locale.getString('contacts.business_phone'),
                            type: 'string',
                            export: {
                                group: 'contacts.business-address'
                            },
                            listview: 'hidden'
                        },
                        business_phone_2: {
                            title: locale.getString('contacts.business_phone_2'),
                            type: 'string',
                            export: {
                                group: 'contacts.business-address'
                            },
                            listview: 'hidden'
                        },
                        business_fax: {
                            title: locale.getString('contacts.business_fax'),
                            type: 'string',
                            export: {
                                group: 'contacts.business-address'
                            },
                            listview: 'hidden'
                        },
                        business_web: {
                            title: locale.getString('contacts.business_web'),
                            type: 'string',
                            export: {
                                group: 'contacts.business-address'
                            },
                            listview: 'hidden'
                        },
                        preferred_street: {
                            title: locale.getString('contacts.preferred_street'),
                            type: 'string',
                            export: {
                                group: 'contacts.preferred-address'
                            },
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_street_2: {
                            title: locale.getString('contacts.preferred_street_2'),
                            type: 'string',
                            export: {
                                group: 'contacts.preferred-address'
                            },
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_zip: {
                            title: locale.getString('contacts.preferred_zip'),
                            type: 'string',
                            export: {
                                group: 'contacts.preferred-address'
                            },
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_city: {
                            title: locale.getString('contacts.preferred_city'),
                            type: 'string',
                            export: {
                                group: 'contacts.preferred-address'
                            },
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_country: {
                            title: locale.getString('contacts.preferred_country'),
                            type: 'string',
                            export: {
                                group: 'contacts.preferred-address'
                            },
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_email: {
                            title: locale.getString('contacts.preferred_email'),
                            type: 'string',
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_phone: {
                            title: locale.getString('contacts.preferred_phone'),
                            type: 'string',
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_phone_2: {
                            title: locale.getString('contacts.preferred_phone_2'),
                            type: 'string',
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_fax: {
                            title: locale.getString('contacts.preferred_fax'),
                            type: 'string',
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_web: {
                            title: locale.getString('contacts.preferred_web'),
                            type: 'string',
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_company_name: {
                            title: locale.getString('contacts.preferred_company_name'),
                            type: 'string',
                            export: {
                                group: 'contacts.preferred-address'
                            },
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        preferred_department: {
                            title: locale.getString('contacts.preferred_department'),
                            type: 'string',
                            export: {
                                group: 'contacts.preferred-address'
                            },
                            listview: 'hidden',
                            columnDef: {
                                enableFiltering: false
                            }
                        },
                        birth_day: {
                            title: locale.getString('profile.birth_day'),
                            type: 'string',
                            listview: 'hidden',
                            export: {
                                group: 'contacts.formalities'
                            },
                            format: 'date',
                            'x-schema-form': {
                                type: 'datepicker',
                                maxDate: new Date(),
                                defaultDate: new Date(),
                                open: false
                            }
                        },
                        categories: {
                            title: locale.getString('common.categories'),
                            type: 'string',
                            listview: 'hidden',
                            columnDef: {
                                type: 'select-box',
                                enableSorting: false,
                                conditions: {
                                    exclusive: false
                                },
                                template: function (categories) {
                                    if (categories) {
                                        return _.pluck(categories.data, 'name').join(', ');
                                    }
                                },
                                onFilter: function (filter, manager) {
                                    if (filter.col.conditions.exclusive) {
                                        manager.addQuery('category_condition', 'AND')
                                    } else {
                                        manager.addQuery('category_condition', 'OR')
                                    }
                                    return manager;
                                }
                            }
                        },
                        duplicate: {
                            title: locale.getString('profile.duplicate'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0],
                            columnDef: {
                                enableSorting: false
                            },
                            mergeable: false
                        },
                        duplicate_of: {
                            title: locale.getString('profile.duplicate_of'),
                            listview: 'hidden',
                            type: 'integer',
                            mergeable: false,
                            'x-schema-form': {
                                type: 'select-box',
                                valueField: 'id',
                                displayField: 'id',
                                config: {
                                    model: $model,
                                    settings: {}
                                }
                            }
                        },
                        optin: {
                            title: locale.getString('profile.optin'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        blacklist: {
                            title: locale.getString('profile.blacklist'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        blacklist_reason: {
                            title: locale.getString('profile.blacklist_reason'),
                            type: 'string',
                            listview: 'hidden'
                        },
                        comment: {
                            title: locale.getString('profile.comment'),
                            type: 'string',
                            listview: 'hidden'
                        },
                        optin_at: {
                            title: locale.getString('profile.optin_at'),
                            type: 'datetime',
                            listview: 'hidden'
                        },
                        optin_ip: {
                            title: locale.getString('profile.optin_ip'),
                            type: 'string',
                            listview: 'hidden'
                        },
                        changelog: {
                            title: locale.getString('profile.changelog'),
                            type: 'string',
                            listview: false,
                            mergeable: false
                        },
                        show_rate: {
                            title: locale.getString('contacts.show_rate'),
                            type: 'string',
                            export: {
                                group: 'contacts.stats'
                            },
                            listview: 'hidden'
                        },
                        checkins_30: {
                            title: locale.getString('contacts.checkins_30'),
                            type: 'string',
                            export: {
                                group: 'contacts.stats'
                            },
                            listview: 'hidden'
                        },
                        rsvps_120: {
                            title: locale.getString('contacts.rsvps_120'),
                            type: 'string',
                            export: {
                                group: 'contacts.stats'
                            },
                            listview: 'hidden'
                        },
                        checkins_120: {
                            title: locale.getString('contacts.checkins_120'),
                            type: 'string',
                            export: {
                                group: 'contacts.stats'
                            },
                            listview: 'hidden'
                        },
                        rsvps_all: {
                            title: locale.getString('contacts.rsvps_all'),
                            type: 'string',
                            export: {
                                group: 'contacts.stats'
                            },
                            listview: 'hidden'
                        },
                        checkins_all: {
                            title: locale.getString('contacts.checkins_all'),
                            type: 'string',
                            export: {
                                group: 'contacts.stats'
                            },
                            listview: 'hidden'
                        },
                        rsvps_30: {
                            title: locale.getString('profile.rsvps_30'),
                            type: 'string',
                            export: {
                                group: 'contacts.stats'
                            },
                            listview: 'hidden'
                        },
                        bic: {
                            title: locale.getString('profile.bic'),
                            type: 'string',
                            listview: 'hidden'
                        },
                        iban: {
                            title: locale.getString('profile.iban'),
                            type: 'string',
                            listview: 'hidden'
                        },
                        last_invoice_number: {
                            title: locale.getString('profile.last_invoice_number'),
                            type: 'string',
                            listview: 'hidden'
                        },
                        paid: {

                            title: locale.getString('profile.paid'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        created_at: {
                            title: locale.getString('profile.created_at'),
                            type: 'string',
                            listview: 'hidden',
                            format: 'datetime',
                            mergeable: false
                        },
                        updated_at: {
                            title: locale.getString('profile.updated_at'),
                            type: 'string',
                            listview: 'hidden',
                            format: 'datetime',
                            mergeable: false
                        },
                        last_checked_in_at: {
                            title: locale.getString('profile.last_checked_in_at'),
                            type: 'string',
                            listview: 'hidden',
                            format: 'datetimeexact',
                            mergeable: false
                        },
                        last_invoice_at: {
                            title: locale.getString('profile.last_invoice_at'),
                            type: 'string',
                            listview: 'hidden',
                            format: 'datetime',
                            mergeable: false
                        },
                        last_paid_at: {
                            title: locale.getString('profile.last_paid_at'),
                            type: 'string',
                            listview: 'hidden',
                            format: 'datetime',
                            mergeable: false
                        }
                    },
                    required: []
                };

                var customTabItems = [];

                for (var i = 1; i <= 40; i++) {

                    var attr = user.company.data['custom_' + i + '_name'];

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
                                    return { value: option, name: option };
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
                            schema.properties['custom_' + i]['original'].startDirectory = 'contacts';
                        }

                        //TODO:: write directive for datetimepicker
                        //if (attr.type == 'datetime') {
                        //  schema.properties['custom_' + i]['type'] = 'string';
                        //  schema.properties['custom_' + i]['format'] = 'datetime';
                        //}

                        customTabItems[i] = 'custom_' + i;
                    }

                }

                if (customTabItems.length > 0) { // If there are any customs tab create Custom tab in form

                    return schema;

                    var index = _.findIndex($model.form[0].tabs, { title: 'Custom fields' });
                    if (index == -1) {
                        $model.form[0].tabs.push({
                            title: 'Custom fields',
                            items: customTabItems,
                            maxItems: 40,
                            type: 'array'
                        });
                    } else {
                        $model.form[0].tabs[index] = {
                            title: 'Custom fields',
                            items: customTabItems,
                            maxItems: 40,
                            type: 'array'
                        };
                    }
                }
                return schema;
            });
        });
    };

    $model.filters = [{
        name: 'Contacts with less checkins than invites',
        query: [{
            operator: '>=',
            field: 'rsvps_all',
            value: '3'
        }, {
            operator: '<',
            field: 'checkins_all',
            value: '{{RSVPS_ALL}}'
        }]
    }];

    $model.defaultSort = [{ field: 'last_name', direction: 'DESC' }];

    $model.importRecords = importRecords;
    $model.getDuplicate = getDuplicate;
    $model.getMergeableFields = getMergeableFields;

    //Adding restangular model methods to the 'contact' model
    Restangular.extendModel('contacts', function (model) {
        model.addRestangularMethod('checkin', 'post', 'checkin');
        return model;
    });

    //Adding restangular collection methods to the 'contacts' collection
    Restangular.extendCollection('contacts', function (collection) {
        collection.addRestangularMethod('getDuplicates', 'get', 'duplicates', { include: 'duplicates' });
        return collection;
    });

    return $model;

    function importRecords(records) {
        return $http.post(Env.apiUrl + '/contacts/import', records);
    }

    function getMergeableFields() {
        return $model.getFields().then(function (fields) {
            return _.filter(fields, 'mergeable');
        });
    }


    function getDuplicate(id, query) {

        if (!_.isUndefined(query))
            query.include = 'duplicates';
        else
            query = { include: 'duplicates' };

        return $model.one(id).get(query);
    }

    function getDuplicates(query) {

        if (!_.isUndefined(query))
            query.include = 'duplicates';
        else
            query = { include: 'duplicates' };

        var list = Restangular.all('contacts').customGETLIST('duplicates', query);
        list.getList = $model.getDuplicates;
        return list;
    }
}
