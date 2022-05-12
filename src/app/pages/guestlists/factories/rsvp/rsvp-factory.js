/**
 * @ngdoc service
 * @name guestlists.factory:Rsvp
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('Rsvp', [
        '$auth',
        'Contact',
        'locale',
        'Resource',
        'Restangular',
        '$stateParams',
        Rsvp
    ]);

function Rsvp($auth, Contact, locale, Resource, Restangular, $stateParams) {
    var $model = Resource.make('rsvps');

    $model.title = ' Bookings';

    $model.locales = ['rsvps', 'common', 'profile'];

    $model.schema =
        $auth.getUser().then(function (user) {

            // Definition of local properties
            var properties = {
                profile_image: {
                    field: 'contact.data.profile_image',
                    title: locale.getString('profile.profile_image'),
                    type: 'object',
                    listview: 'hidden',
                    mergeable: false,
                    columnDef: {
                        width: 45,
                        enableFiltering: false,
                        displayName: ' ',
                        template: '<img class="grid-image img-responsive" ng-src="{{row.contact.data.profile_image.url}}">',
                        'template-gridview': '<div class="image" style="background-image:url($$value$$); "></div>'
                    },
                    'format': 'file_upload',
                    'x-schema-form': {
                        type: 'file',
                        uploadOptions: {
                            modale: {
                                flow: {
                                    dropEnabled: true,
                                    imageOnly: true
                                }
                            }
                        }
                    }
                },
                full_name: {
                    field: 'contact.data.full_name',
                    title: 'Full Name',
                    column_size: 'size-large',
                    type: 'string',
                    export: {
                        group: 'contacts.overview',
                        field: 'contact.full_name'
                    },
                    columnDef: {
                        main: true,
                        template: '<a ng-click="ngListView.manager.vm.showContact(row)" style="padding-right: 5px;"><i class="fal fa-user"></i></a> ' +
                            '<a>{{row.contact.data.full_name || "No name"}}</a>'
                    }
                },
                code: {
                    title: 'Contact Code',
                    field: 'contact.data.code',
                    type: 'string',
                    export: {
                        group: 'contacts.settings',
                        field: 'contact.code'
                    },
                    listview: 'hidden'
                },
                guestlist_name: {
                    field: 'guestlist.data.name',
                    title: locale.getString('guestlists.name'),
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        field: 'guestlist.name',
                        group: 'rsvps.details'
                    },
                    mergeable: false
                },
                guestlist_date: {
                    field: 'guestlist.data.date',
                    title: locale.getString('guestlists.date'),
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        field: 'guestlist.date',
                        group: 'rsvps.details'
                    },
                    mergeable: false
                },
                guestlist_id: {
                    title: locale.getString('common.guestlist'),
                    type: 'string',
                    listview: false,
                    mergeable: false
                },
                contact_id: {
                    title: locale.getString('common.contact'),
                    type: 'string',
                    listview: false,
                    mergeable: false
                },
                parent_rsvp_id: {
                    title: 'Guest Of',
                    type: 'string',
                    mergeable: false,
                    export: {
                        group: 'rsvps.details'
                    },
                    field: 'parent',
                    columnDef: {
                        template: function (parent) {
                            var template = '-';
                            if (parent) {
                                template = '<span ng-click="ngListView.manager.actionClicked(ngListView.adapter.meta.actions.mainRow, row, $parent.$parent.$index, $parent)">' + parent.data.contact.data.full_name + '</span> ';
                            }
                            return template;
                        }
                    },
                    'x-schema-form': {
                        type: 'select-box',
                        valueField: 'id',
                        displayField: 'contact.data.full_name',
                        config: {
                            items: getRsvps,
                            model: getModel,
                            settings: {}
                        }
                    }
                },
                uid: {
                    title: locale.getString('common.uid'),
                    type: 'string',
                    listview: false,
                    mergeable: false
                },
                pax_planned: {
                    title: 'Pax Planned',
                    type: 'string',
                    export: {
                        group: 'rsvps.details'
                    }
                },
                pax_actual: {
                    title: 'Pax Checked In',
                    type: 'string',
                    export: {
                        group: 'rsvps.details'
                    }
                },
                status: {
                    title: 'Status',
                    type: 'string',
                    export: {
                        group: 'rsvps.details'
                    },
                    enum: ['listed', 'requested', 'invited', 'confirmed', 'cancelled', 'waitlisted']
                },
                payment: {
                    title: 'Payment',
                    type: 'string',
                    export: {
                        group: 'rsvps.details'
                    },
                    enum: ['pending', 'confirmed', 'failed'],
                    listview: 'hidden'
                },
                priority: {
                    title: 'Priority',
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    enum: ['a', 'b', 'c', 'd', 'e']
                },
                color: {
                    title: 'Color',
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    enum: ['red', 'orange', 'green', 'pink', 'blue']
                },
                registration_type: {
                    title: 'Registration Type',
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    enum: ['password', 'code']
                },
                comment: {
                    title: 'Comment',
                    type: 'string',
                    listview: 'hidden'
                },
                seats: {
                    title: 'Seats',
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    columnDef: {
                        template: '<span>{{ row.seats.join(", ")}}</span>'
                    }
                },
                changelog: {
                    title: locale.getString('common.changelog'),
                    type: 'string',
                    listview: false,
                    mergeable: false
                },
                checkedin_at: {
                    title: locale.getString('rsvps.checkedin_at'),
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    format: 'datetime'
                },
                requested_at: {
                    title: locale.getString('rsvps.requested_at'),
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    format: 'datetime'
                },
                invited_at: {
                    title: locale.getString('rsvps.invited_at'),
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    format: 'datetime'
                },
                confirmed_at: {
                    title: locale.getString('rsvps.confirmed_at'),
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    format: 'datetime'
                },
                cancelled_at: {
                    title: locale.getString('rsvps.cancelled_at'),
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    format: 'datetime'
                },
                waitlisted_at: {
                    title: locale.getString('rsvps.waitlisted_at'),
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    format: 'datetime'
                },
                booking_code: {
                    title: 'Booking Code',
                    field: 'code',
                    custom_slug: 'code',
                    listview: true,
                    type: 'string',
                    export: {
                        group: 'rsvps.details'
                    },
                    mergeable: false
                },
                used_code: {
                    title: 'Booking Used Code',
                    listview: 'hidden',
                    type: 'string',
                    export: {
                        group: 'rsvps.details'
                    },
                    mergeable: false
                },
                created_at: {
                    title: locale.getString('profile.created_at'),
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    format: 'datetime',
                    mergeable: false
                },
                updated_at: {
                    title: locale.getString('profile.updated_at'),
                    type: 'string',
                    listview: 'hidden',
                    export: {
                        group: 'rsvps.details'
                    },
                    format: 'datetime',
                    mergeable: false
                }
            };


            var schema = {
                type: 'object',
                title: locale.getString('common.rsvp'),
                properties: properties,
                required: ['pax_planned']
            };
            // Contact properties should be included first (to have correct display sequence in frontend)
            return Contact.getSchema()
                .then(function (_schema) {
                    const newProperties = {};
                    _.each(_schema.properties, function (col, attr) {
                        col.field = 'contact.data.' + attr;
                        if (col.export) {
                            col.export.field = 'contact.' + attr;
                        }
                        newProperties['contact_' + attr] = col;
                    });
                    // Then append the local properties, potentially overwriting
                    schema.properties = _.defaultsDeep(properties, newProperties);

                    return schema;
                });
        });

    $model.setGuestlist = setGuestlist;


    //Adding restangular model methods to the 'rsvp' model
    Restangular.extendModel('rsvps', function (model) {
        model.addRestangularMethod('checkin', 'post', 'checkin');
        return model;
    });

    //Adding restangular collection methods to the "rsvps" collection
    Restangular.extendCollection('rsvps', function (collection) {
        collection.addRestangularMethod('getDuplicates', 'get', 'duplicates', {include: 'duplicates'});
        return collection;
    });

    return $model;

    function setGuestlist(guestlist) {

        var original = $model;

        if (guestlist.id === 'master') {
            $model = Resource.make('rsvps');
        } else {
            $model = Resource.make('rsvps', {path: 'guestlists', id: guestlist.id});
        }

        $model.form = [];
        $model.guestlist_id = guestlist.id;
        $model.guestlist = guestlist;
        $model.schema = locale.ready(original.locales).then(function () {

            return original.schema.then(function (schema) {
                for (var i = 1; i < 41; i++) {
                    var attr = guestlist['custom_' + i + '_name'];
                    if (attr && attr.length > 0 || _.keys(attr).length > 0) {
                        schema.properties['custom_' + i] = {
                            title: attr.name,
                            type: attr.type,
                            listview: 'hidden',
                            export: {
                                group: 'rsvps.custom_fields'
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
                        }

                        if (attr.type == 'textarea') {
                            schema.properties['custom_' + i]['type'] = 'string';
                            schema.properties['custom_' + i]['x-schema-form'] = {
                                type: 'textarea'
                            }
                        }

                        if (attr.type == 'date') {
                            schema.properties['custom_' + i]['type'] = 'string';
                            schema.properties['custom_' + i]['format'] = 'date';
                        }

                        if (attr.type == 'datetime') {
                            schema.properties['custom_' + i]['type'] = 'string';
                            schema.properties['custom_' + i]['format'] = 'datetime';
                        }
                        if (!_.find($model.form, {key: 'custom_' + i})) {

                            $model.form.push({key: 'custom_' + i});
                        }
                    }
                }
                return schema;
            });
        });

        $model.getForm = getForm;
        $model.getModel = getModel;
        $model.getRsvps = getRsvps;
        $model.importRecords = importRecords;
        $model.getMergeableFields = getMergeableFields;
        $model.mergeDuplicates = mergeDuplicates;
        $model.getDuplicate = getDuplicate;
        $model.getDuplicates = getDuplicates;
        //$model.checkIn = checkIn;
        return $model;
    }

    function getForm() {
        return $model.getSchema().then(function (schema) {
            var form = [];
            _.each($model.form, function (field) {
                if (!_.isObject(field)) {
                    field = {key: field};
                }
                field = _.defaultsDeep(field, _.get(schema.properties, [field.key, 'x-schema-form'], {}), schema.properties[field.key]);
                if (field.type == 'string') {
                    if (field.enum) {
                        field.type = 'select';
                    } else if (field.format) {
                        field.type = field.format;
                    } else {
                        field.type = 'textbox';
                    }
                }
                form.push(field);
            });
            return form;
        });
    }

    function getModel() {
        return $model;
    }

    function getRsvps() {
        return $model.getList().then(function (rsvps) {
            return _.reject(rsvps, {id: $stateParams.rid});
        });
    }

    function getMergeableFields() {
        return $model.getFields().then(function (fields) {
            return _.filter(fields, 'mergeable');
        });
    }

    function mergeDuplicates(guestlist, rsvps, strategy, fields) {


        var data, url;

        data = {
            keys: rsvps,
            strategy: strategy,
            fields: fields
        };
        url = 'guestlists/'.concat(guestlist.id).concat('/rsvps');

        return Restangular.all(url).customPOST(data, "merge");
    }

    function getDuplicate(id, query) {
        return $model.one(id).get(query);
    }

    function getDuplicates(guestlist, query) {
        var url = 'guestlists/'.concat(guestlist.id).concat('/rsvps');
        return Restangular.all(url).doGETLIST('duplicates', query);
    }

    function importRecords(records) {
        records.guestlist_id = $model.guestlist_id;
        var url = 'guestlists/'.concat(records.guestlist_id).concat('/rsvps/import');
        return Restangular.one(url).customPOST(records);
    }

    function checkin(data) {
        return $model.one().customPOST(data, 'checkins');
    }
}
