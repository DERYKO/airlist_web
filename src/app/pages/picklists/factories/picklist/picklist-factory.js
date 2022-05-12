import addContactTemplate from '../../views/contacts/add-contact-modal.tpl.html';


/**
 * @ngdoc service
 * @name picklists.factory:Picklist
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .factory('Picklist', [
        'locale',
        '$q',
        'Resource',
        'Restangular',
        'SelectBox',
        '$uibModal',
        Picklist
    ]);

function Picklist(locale, $q, Resource, Restangular, SelectBox, $uibModal) {
    var $model = Resource.make('picklists');

    $model.locales = ['common', 'customs', 'picklists'];
    $model.schema = locale.ready($model.locales).then(function () {
        return {
            type: 'object',
            title: locale.getString('picklists.title_details'),
            properties: {
                name: {
                    title: locale.getString('picklists.name'),
                    type: 'string',
                    columnDef: {
                        column_size: 'size-large',
                        main: true
                    }
                },
                amount_contacts: {
                    title: 'Amount Contacts',
                    field: 'amount_contacts',
                    columnDef: {
                        column_size: 'size-small',
                        enableFiltering: false,
                        enableSorting: false
                    }
                },
                permission: {
                    title: locale.getString('picklists.permission'),
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
                customs: {
                    type: "builder",
                    maxItems: 20,
                    listview: false
                },
                changelog: {
                    title: locale.getString('profile.changelog'),
                    type: 'string',
                    listview: 'hidden'
                }
            },
            required: ['name', 'date']
        };
    });

    $model.addToPicklist = addToPicklist;
    $model.addContacts = addContacts;
    $model.getCustomColumns = getCustomColumns;

    function getCustomColumns(picklist) {
        var i = 1, cols = [];
        for (i; i < 21; i++) {
            if (_.keys(picklist['custom_' + i + '_name']).length > 0) {
                var elem = getSchemaDefinition(picklist['custom_' + i + '_name'])


                var columnDef = _.isUndefined(elem.columnDef) ? {} : elem.columnDef;

                columnDef.field = 'picklist_custom_' + i;

                if (_.isUndefined(columnDef.name)) {
                    columnDef.name = !_.isUndefined(elem.title) && elem.title && elem.title.length > 0 ? elem.title : elem.slug;
                }

                if (_.isUndefined(columnDef.type)) {
                    columnDef.type = elem.format ? elem.format : elem.type;
                }

                if (_.isUndefined(columnDef.main)) {
                    columnDef.main = false;
                }

                columnDef.optional = !columnDef.main;
                if (columnDef.main) {
                    columnDef.visible = true;
                }

                if (!_.isUndefined(elem.format)) {
                    columnDef.type = elem.format;
                }

                if (_.isUndefined(columnDef.visible)) {
                    columnDef.visible = _.isUndefined(elem.listview) || elem.listview !== 'hidden';
                }

                if (_.isUndefined(columnDef.enableSorting)) {
                    columnDef.enableSorting = true;
                }

                if (_.isUndefined(columnDef.enableFiltering)) {
                    columnDef.enableFiltering = true;
                }

                if (_.isUndefined(columnDef.enum) && !_.isUndefined(elem.enum)) {
                    if (columnDef.type == 'string') columnDef.type = 'select';
                    columnDef.enum = elem.enum;
                }

                if (_.isUndefined(columnDef.titleMap) && !_.isUndefined(elem['x-schema-form']) && !_.isUndefined(elem['x-schema-form'].titleMap)) {
                    columnDef.titleMap = _.cloneDeep(elem['x-schema-form'].titleMap);

                }

                if (_.isUndefined(columnDef.titleMap) && !_.isUndefined(columnDef.enum)) {
                    columnDef.titleMap = _.map(columnDef.enum, function (item) {
                        return {value: item, name: item};
                    });

                }

                if (columnDef.type !== 'boolean' && !_.isUndefined(columnDef.titleMap)) {
                    if (!_.find(columnDef.titleMap, {value: 'EMPTY', name: 'EMPTY'})) {
                        columnDef.titleMap.unshift({value: 'EMPTY', name: 'EMPTY'});
                    }
                }

                if (_.isUndefined(columnDef.column_size)) {
                    columnDef.column_size = 'size-medium';
                }

                if (_.isUndefined(columnDef.export) && !_.isUndefined(elem.export)) {
                    columnDef.export = elem.export;
                }

                cols.push(columnDef);
                // var col = {
                //   type: elem.format ? def.format : def.enum ? 'select' : def.type,
                //   name: def.title,
                //   title: def.title,
                //   visible: false,
                //   field: 'picklist_custom_' + i
                // };
                // if (def.enum) {
                //   var field = getFormDefinition(i, picklist['custom_' + i + '_name']);
                //   col.titleMap = field.titleMap;
                //   col.enum = field.enum;
                // }

            }
        }
        return cols;
    }

    function addToPicklist(contacts) {
        return SelectBox.multiple($model, {
            settings: {
                addNew: false
            }
        }).then(function (response) {
            return addContacts(response.keys, contacts);
        }, function (response) {
            return $q.reject(response);
        });
    }

    function getFormDefinition(index, field) {
        var def = {
            key: 'custom_' + index
        };
        switch (field.type) {
            case 'textarea':
                def.type = 'textarea';
                break;
            case 'select':
                def.titleMap = _(field.enum).filter(function (option) {
                    return !_.isNull(option);
                }).map(function (option) {
                    return {value: option, name: option};
                }).value();
                break;
            case 'boolean':
                def.type = 'boolean';
                def.style = {
                    selected: 'btn-success',
                    unselected: 'btn-default'
                };
                def.titleMap = [
                    {value: true, name: locale.getString('common.yes')},
                    {value: false, name: locale.getString('common.no')}
                ];
                break;
            case 'decimal':
                def['string-to-number'] = true;
                break;
        }

        return def;
    }

    function getContactsForm(picklist) {
        var form = [];
        for (var i = 1; i <= 20; i++) {
            if (picklist['custom_' + i + '_name'] && _.keys(picklist['custom_' + i + '_name']).length > 0) {
                form.push(getFormDefinition(i, picklist['custom_' + i + '_name']))
            }
        }
        return form;
    }

    function getSchemaDefinition(field) {
        var def = {
            type: 'string',
            title: field.name
        };
        switch (field.type) {
            case 'date':
                def.type = 'string';
                def.format = 'date';
                break;
            case 'select':
                def.enum = field.enum;
                break;
            case 'boolean':
                def.type = 'boolean';
                def.enum = [true, false];
                break;
            case 'integer':
                def.type = 'number';
                break;
            case 'decimal':
                def.type = 'number';
                break;
        }
        return def;
    }

    function getContactsSchema(picklist) {
        var schema = {
            title: 'Picklist Contacts',
            type: 'object',
            properties: {}
        };

        for (var i = 1; i <= 20; i++) {
            if (picklist['custom_' + i + '_name'] && _.keys(picklist['custom_' + i + '_name']).length > 0) {
                schema.properties['custom_' + i] = getSchemaDefinition(picklist['custom_' + i + '_name']);
            }

        }

        return schema;
    }

    function addContacts(picklist, contacts, defaults) {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: addContactTemplate,
            controller: ['$uibModalInstance', 'defaults', function ($uibModalInstance, defaults) {
                var vm = this;

                vm.form = getContactsForm(picklist);
                vm.schema = getContactsSchema(picklist);
                vm.model = defaults;
                vm.save = save;
                vm.cancel = cancel;

                if (vm.form.length == 0) {
                    $uibModalInstance.opened.then(function () {
                        return $uibModalInstance.close([]);
                    });
                }

                function save(fields) {
                    $uibModalInstance.close(fields);
                }

                function cancel() {
                    $uibModalInstance.dismiss('cancel');
                }
            }],
            resolve: {
                defaults: function () {
                    return _.isUndefined(defaults) ? {} : defaults;
                }
            },
            controllerAs: 'picklist'
        });

        return modalInstance.result.then(function (fields) {
            var picklists = {
                items: [picklist.id]
            };

            return Restangular.one('picklists/contacts').post('', {
                fields: fields,
                contacts: contacts,
                keys: picklists
            });
        }, function (response) {
            return $q.reject(response);
        });
    }

    return $model;
}
