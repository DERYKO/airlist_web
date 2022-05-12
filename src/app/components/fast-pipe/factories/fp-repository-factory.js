

/**
 * @ngdoc service
 * @name fast-pipe.factories:FastPipeRepository
 *
 * @description
 *
 */
angular
    .module('airlst.fast-pipe')
    .factory('FastPipeRepository', FastPipeRepository);

function FastPipeRepository(locale, $q, Env, $http, $filter) {
    var $fpRepository = {};

    $fpRepository.make = function (resource_path) {
        var $repo = this;

        $repo.path = 'fp/' + resource_path;
        $repo.locales = [
            'components'
        ];
        $repo.text = {};

        $repo.getColumns = function (prefix) {
            return locale.ready($repo.locales).then(function () {
                return $q.when($repo.columns).then(function (columns) {
                    return prepareColumns(columns, prefix);
                });
            });
        };


        $repo.getColumn = function (colKey) {
            return $repo.getColumns().then(function (columns) {
                var filteredCols = $filter('filter')(columns, {key: colKey});

                if (filteredCols.length > 0) {
                    return filteredCols[0];
                }
                return null;
            });
        };

        $repo.getText = function (key) {
            if (typeof $repo.text[key] !== 'undefined') {
                return $repo.text[key];
            } else {
                return false;
            }
        };

        $repo.ready = function (callback) {
            var actionsToWaitFor = [
                locale.ready($repo.locales)
            ];

            $q.all(actionsToWaitFor).then(function () {
                callback();
            });
        };

        $repo.getList = function (fields, filters, sort, pagination) {
            return $http.post(Env.apiUrl + '/' + $repo.path, prepareDataForRequest(fields, filters, sort, pagination));
        };

        function prepareColumns(columns, prefix) {
            var defaultColConfig = {
                    key: '',
                    title: '',
                    type: 'string',
                    enableSorting: true,
                    enableFilter: true,
                    enableClick: false,
                    parse: function (value) {
                        return value;
                    },
                    buildFilterValue: function (searchValue) {
                        return {
                            field: this.key,
                            operator: 'LIKE',
                            value: searchValue
                        };
                    }
                },
                returnColumns = [];

            _.forEach(columns, function (originalCol, key) {
                returnColumns[key] = _.defaultsDeep(defaultColConfig, originalCol);
            });

            return returnColumns;
        }

        function prepareDataForRequest(fields, filters, sort, pagination) {
            return {
                fields: fields,
                filters: filters,
                sort: sort,
                pagination: pagination
            }
        }

        return $repo;
    };

    return $fpRepository;
}