

/**
 * @ngdoc object
 * @name toolbox.controller:ToolboxCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.toolbox')
    .controller('ToolboxCtrl', [
        'Contact',
        'Env',
        '$http',
        'locale',
        '$q',
        'Restangular',
        'Rsvp',
        '$scope',
        'SweetAlert',
        ToolboxCtrl
    ]);

function ToolboxCtrl(Contact, Env, $http, locale, $q, Restangular, Rsvp, $scope, SweetAlert) {
    var vm = this;
    vm.useFilter = useFilter;
    vm.applyQuery = applyQuery;
    vm.runQuery = runQuery;

    init();

    function resetFilters() {
        vm.builder = {
            schema: {
                type: 'object',
                title: locale.getString('common.custom_attributes'),
                required: ['query'],
                properties: {
                    query: {
                        type: 'array',
                        maxItems: 20,
                        items: {
                            type: 'object',
                            properties: {
                                value: {
                                    title: 'Value',
                                    type: 'string',
                                    'x-schema-form': {
                                        type: 'typehead',
                                        options: []
                                    }
                                },
                                field: {
                                    title: 'Field',
                                    type: 'string',
                                    'x-schema-form': {
                                        type: 'select',
                                        titleMap: []
                                    }
                                },
                                operator: {
                                    title: 'Operator',
                                    type: 'string',
                                    default: '=',
                                    enum: [
                                        '=',
                                        '<>',
                                        '>',
                                        '>=',
                                        '<',
                                        '<='
                                    ]
                                }
                            },
                            required: ['field', 'operator']
                        }
                    }
                }
            },
            form: [
                {
                    type: 'simple-array',
                    key: 'query',
                    add: 'Add Filter',
                    style: {
                        add: 'btn-info btn-sm'
                    },
                    name: '',
                    items: [
                        {
                            'type': 'section',
                            'htmlClass': 'row',
                            'items': [
                                {
                                    'type': 'section',
                                    'htmlClass': 'col-sm-5',
                                    'items': [
                                        'query[].field']
                                }, {
                                    'type': 'section',
                                    'htmlClass': 'col-sm-2',
                                    'items': [
                                        'query[].operator']
                                },
                                {
                                    'type': 'section',
                                    'htmlClass': 'col-sm-5',
                                    'items': [
                                        'query[].value'
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            model: {
                name: 'Custom Query',
                query: []
            }
        }
    }

    function init() {
        locale.ready('common').then(function () {
            vm.availableFilters = {
                contacts: {
                    available: true,
                    enabled: true,
                    slug: 'contacts',
                    name: 'Contact',
                    model: Contact,
                    icon: 'fa fa-group',
                    title: locale.getString('common.contacts'),
                    disables: ['guestlists'],
                    settings: {
                        filterable: 'internal',
                        pagination: 'internal',
                        sorting: 'internal',
                        dropdowns: {
                            add: false,
                            columns: true,
                            archived: false,
                            import: false,
                            duplicates: false
                        }
                    }
                },
                rsvps: {
                    available: false,
                    enabled: true,
                    slug: 'rsvps',
                    name: 'Rsvp',
                    model: Rsvp,
                    icon: 'fa fa-group',
                    title: locale.getString('common.rsvps'),
                    enables: ['guestlists']
                },
                guestlists: {
                    available: false,
                    enabled: false,
                    slug: 'guestlists',
                    icon: 'fa fa-group',
                    title: locale.getString('common.guestlists'),
                    disables: ['contacts']
                }
            }
        });
        resetFilters();
    }

    function useFilter(filter) {
        resetFilters();
        filter.using = !filter.using;
        if (filter.using) {
            vm.filter = filter;
            filter.model.getSchema().then(function (schema) {
                _.forEach(schema.properties, function (col, slug) {
                    if (!_.isUndefined(slug)) {
                        vm.builder.schema.properties.query.items.properties.field['x-schema-form'].titleMap.push({
                            value: slug,
                            name: !_.isUndefined(col.title) && col.title && col.title.length > 0 ? col.title : slug
                        });
                        vm.builder.schema.properties.query.items.properties.value['x-schema-form'].options.push(
                            String.prototype.concat('{{', ((!_.isUndefined(col.title) && col.title && col.title.length > 0) ? col.title : slug), '}}').toUpperCase()
                        )
                    }
                })
                vm.searchContacts = true;
            });
            filter.model.getFields().then(function (fields) {
                vm.fields = [];
                fields.forEach(function (field) {
                    vm.fields[field.slug] = field.name;
                })
            });
            filter.model.getPredefinedFilters().then(function (queries) {
                vm.predefinedQueries = queries;
            });
        }
        vm.showFilters = filter.using;
    }

    function applyQuery(query) {
        vm.builder.model = _.cloneDeep(query);
    }

    function runQuery(form) {
        $scope.$broadcast('schemaFormValidate');
        if (_.isUndefined(form) || form.$valid) {
            getResults(vm.filter.name, vm.builder.model.query).then(function (result) {
                console.log(result);
                vm.collection = result;
            }, function (response) {
                SweetAlert.error(locale.getString('sweetalerts.request_failed'), response.data.message);
            });

        }
    };

    function getResults(type, query) {
        return $http.post(Env.apiUrl.concat('/toolbox/query'), {
            model: type,
            query: query
        }).then(function (response) {
            return Restangular.restangularizeCollection(null, response.data.data, 'contacts');
        }, function (response) {
            $q.reject(response);
        })
    }
}