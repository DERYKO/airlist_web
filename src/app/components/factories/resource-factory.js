

/**
 * @ngdoc service
 * @name components.factory:Resource
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .factory('Resource', [
        'locale',
        'Restangular',
        '$q',
        Resource
    ]);

function Resource(locale, Restangular, $q) {
    var $resource = {};
    $resource.make = function (resource_path, parent) {
        var path = '';
        if (!_.isUndefined(parent)) {
            path = ''.concat(parent.path).concat('/').concat(parent.id).concat('/').concat(resource_path);
        } else {
            path = resource_path;
        }

        var $model = Restangular.service(path);
        $model.route = path;
        $model.name = resource_path.charAt(0).toUpperCase() + resource_path.substr(1);
        $model.schema = {};
        $model.defaultSort = [];
        $model.defaultFilters = [];
        $model.form = [];
        $model.filters = [];
        $model.locales = ['auth', 'categories', 'common', 'contacts', 'customs', 'guestlists', 'messages', 'picklists', 'plans', 'profile', 'rsvps', 'sweetalerts', 'settings', 'templates', 'tickets', 'users'];
        $model.getSchema = function () {
            return locale.ready($model.locales).then(function () {
                return $q.when($model.schema).then(function (schema) {
                    return schema
                });
            });
        };

        $model.getForm = function () {
            return $model.form
        };

        $model.getColumns = function () {
            return $model.getSchema().then(function (schema) {
                return _(schema.properties)
                    .map(function (elem, key) {
                        elem.slug = elem.custom_slug ? elem.custom_slug : key;
                        return elem;
                    })
                    .filter(function (elem) {
                        return _.isUndefined(elem.listview) || elem.listview;
                    })
                    .map(function (elem) {
                        var columnDef = _.isUndefined(elem.columnDef) ? {} : elem.columnDef;

                        if (_.isUndefined(columnDef.name)) {
                            columnDef.name = !_.isUndefined(elem.title) && elem.title && elem.title.length > 0 ? elem.title : elem.slug;
                        }
                        if (_.isUndefined(columnDef.search_text)) {
                            columnDef.search_text = 'Search ' + columnDef.name;
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

                        if (_.isUndefined(columnDef.field)) {
                            columnDef.field = !_.isUndefined(elem.field) ? elem.field : elem.slug;
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

                        return columnDef;
                    })
                    .value();
            });
        };

        $model.getExportColumns = function () {
            return $model.getSchema().then(function (schema) {
                return _(schema.properties)
                    .map(function (elem, key) {
                        elem.slug = elem.custom_slug ? elem.custom_slug : key;
                        return elem;
                    })
                    .filter(function (elem) {
                        return elem.export;
                    })
                    .map(function (elem) {
                        var columnDef = _.isUndefined(elem.columnDef) ? {} : elem.columnDef;

                        if (_.isUndefined(columnDef.name)) {
                            columnDef.name = !_.isUndefined(elem.title) && elem.title && elem.title.length > 0 ? elem.title : elem.slug;
                        }

                        if (_.isUndefined(columnDef.field)) {
                            columnDef.field = !_.isUndefined(elem.field) ? elem.field : elem.slug;
                        }

                        if (_.isUndefined(columnDef.type)) {
                            columnDef.type = elem.format ? elem.format : elem.type;
                        }

                        if (_.isUndefined(columnDef.include)) {
                            columnDef.include = _.isUndefined(elem.listview) || elem.listview !== 'hidden';
                        }

                        if (_.isUndefined(columnDef.export) && !_.isUndefined(elem.export)) {
                            columnDef.export = elem.export;
                        }

                        if (_.isObject(columnDef.export) && _.isUndefined(columnDef.export.field)) {
                            columnDef.export.field = columnDef.field;
                        }

                        return columnDef;
                    })
                    .value();
            });
        };

        $model.getFields = function () {
            return $model.getSchema().then(function (schema) {
                return _(schema.properties)
                    .map(function (elem, key) {
                        elem.slug = elem.custom_slug ? elem.custom_slug : key;
                        return elem;
                    })
                    .filter(function (elem) {
                        return _.isUndefined(elem.listview) || elem.listview;
                    })
                    .map(function (elem) {
                        var field = {};
                        field.slug = elem.slug;
                        field.name = !_.isUndefined(elem.title) && elem.title && elem.title.length > 0 ? elem.title : elem.slug;
                        field.mergeable = !_.isUndefined(elem.mergeable) ? elem.mergeable : true;

                        field.type = _.isUndefined(elem.format) ? elem.type : elem.format;
                        if (!_.isUndefined(elem['x-schema-form']) && !_.isUndefined(elem['x-schema-form'].titleMap)) {
                            field.titleMap = elem['x-schema-form'].titleMap;
                        }

                        return field;
                    })
                    .value();
            });
        };

        $model.getFilters = function () {
            return $q.resolve($model.defaultFilters);
        };

        $model.search = function (term) {
            return $model.getList({search: term}).then(function (result) {
                return result;
            });
        };

        $model.getSort = function () {
            return $q.resolve($model.defaultSort);
        };

        $model.getPredefinedFilters = function () {
            return $q.when($model.filters);
        };

        $model.getArchived = function () {
            return $model.getList({archived: 'only'});
        };

        $model.archiveMany = function (keys) {
            var model = $model.one();
            model.keys = keys;
            return model.customDELETE();
        };

        $model.restoreMany = function (collection) {
            return $model.one().customPUT({keys: collection}, 'restore');
        };

        $model.deleteMany = function (collection) {
            var model = $model.one();
            model.keys = collection;
            return model.customDELETE('', {force: true});
        };

        Restangular.extendCollection(path, function (collection) {
            collection.addRestangularMethod('getArchived', 'get', '', {archived: 'only'});
            return collection;
        });

        Restangular.extendModel(path, function (model) {
            model.selectiveSave = function (data) {
                return model.customPUT(data);
            };
            model.addRestangularMethod('restore', 'put', 'restore');
            model.addRestangularMethod('forceDelete', 'remove', '', {force: true});
            return model;
        });

        return $model;
    };
    return $resource;
}