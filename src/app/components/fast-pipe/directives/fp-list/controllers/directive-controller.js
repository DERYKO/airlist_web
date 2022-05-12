

/**
 * @ngdoc object
 * @name airlst.controller:ContactsImportCtrlCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.fast-pipe')
    .controller('FpListDirectiveController', FpListDirectiveController);

function FpListDirectiveController($scope, $q, Error, $filter) {
    var vm = this;
    // General directive definitions
    vm.repo = {};
    vm.loading = false;
    vm.dataLoading = false;
    vm.listCols = [];
    vm.listItems = [];
    vm.activeColumns = [
        'id',
        'name',
        'email',
        'subject',
        'sender_name',
        'bcc',
        'created_at',
        'updated_at'
    ];
    vm.message = {
        show: false,
        type: 'info',
        message: ''
    };

    // Parameters for selection
    vm.selectedRows = [];
    vm.enableSelection = true;
    vm.selectionAllSelected = false;

    // Definition for filters
    vm.showFilters = false;
    vm.filters = [];

    // Definitions for pagination
    vm.pageSizes = [
        25,
        100,
        500,
        1000
    ];
    vm.pagination = {
        page: 1,
        perPage: 25,
        total: 1,
        pages: 1,
        offset: 0
    };

    // Definitions for sort
    vm.sort = {
        name: 'desc'
    };

    vm.updateListContent = updateListContent;
    vm.getText = getText;
    vm.setSort = setSort;
    vm.toggleFilters = toggleFilters;
    vm.clearFilters = clearFilters;
    vm.updateFilter = updateFilter;
    vm.toggleSelection = toggleSelection;
    vm.toggleAllSelection = toggleAllSelection;

    init();

    function init() {
        initWatchers();
        updateView();
    }

    function initWatchers() {
        $scope.$watch('vm.fpRepository', function (newValue) {
            vm.repo = newValue;
            updateView();
        });
        $scope.$watch('vm.pagination.page', function (newValue) {
            vm.pagination.page = newValue;
            updateListContent(true);
        });
        $scope.$watch('vm.pagination.perPage', function (newValue) {
            vm.pagination.perPage = newValue;
            vm.pagination.page = 1;
            updateListContent();
        });
        $scope.$watch('vm.sort', function (newValue) {
            vm.sort = newValue;
            updateListContent();
        });
        $scope.$watch('vm.activeColumns', function (newValue) {
            vm.columns = newValue;
            updateListContent();
        });
    }

    function updateView() {
        if (vm.loading) {
            return;
        }
        vm.loading = true;
        hideMessage();
        if (typeof vm.repo.ready !== 'undefined') {
            vmUpdateColumnsForList();
            vm.repo.ready(function () {
                vm.layout = 'list';
                vm.loading = false;
                updateListContent();
            });
        } else {
            vm.loading = false;
            showMessage('Invalid repo given', 'info');
        }
    }

    function updateListContent(holdPagination) {
        if (vm.dataLoading) {
            return;
        }
        vm.dataLoading = true;
        holdPagination = holdPagination || false;

        if (!holdPagination) {
            resetPagination();
        }
        vm.repo.getList(vm.activeColumns, vm.filters, vm.sort, {
            page: vm.pagination.page,
            perPage: vm.pagination.perPage
        }).then(function (result) {
            vm.dataLoading = false;
            prepareRequestItems(result.data.data);
            prepareRequestPagination(result.data.pagination);
        }, function (error) {
            if (error) {
                Error.default(error);
            }
            vm.dataLoading = false;
            showMessage('Error while loading list', 'error');
        });
    }

    function prepareRequestPagination(requestPagination) {
        vm.pagination.total = requestPagination.total;
        vm.pagination.perPage = requestPagination.perPage;
        vm.pagination.pages = requestPagination.pages;
        vm.pagination.page = requestPagination.current;
        reCalculatePaginationOffset();
    }

    function resetPagination() {
        vm.pagination.page = 1;
    }

    function reCalculatePaginationOffset() {
        vm.pagination.offset = vm.pagination.perPage * (vm.pagination.page - 1);
    }

    function prepareRequestItems(prepareRequestItems) {
        vm.listItems = [];

        _.forEach(prepareRequestItems, function (v) {
            vm.listItems.push(v);
        });
    }

    function showMessage(message, level) {
        vm.message.type = level || 'info';
        vm.message.message = message;
        vm.message.show = true;
    }

    function hideMessage() {
        vm.message.message = '';
        vm.message.show = false;
    }

    function vmUpdateColumnsForList() {
        let actionsToWaitFor = [];
        _.forEach(vm.activeColumns, function (colName) {
            actionsToWaitFor.push(vm.repo.getColumn(colName));
        });

        $q.all(actionsToWaitFor).then(function (results) {
            vm.listCols = [];
            _.forEach(results, function (result) {
                if (result) {
                    vm.listCols.push(result);
                }
            });
        });
    }

    // Functions for View
    function getText(key) {
        if (!vm.loading && vm.repo) {
            var repoText = vm.repo.getText(key);

            if (repoText !== false) {
                return vm.repo.text[key];
            }
        }

        return 'text not defined ' + key;
    }

    function setSort(colKey, direction) {
        if (direction !== 'desc') {
            direction = 'asc';
        }

        if (vm.activeColumns.indexOf(colKey) !== -1) {
            vm.sort = {};
            vm.sort[colKey] = direction;
        }
    }

    function toggleFilters() {
        vm.showFilters = !vm.showFilters;
    }

    function clearFilters() {
        vm.filters = [];
    }

    var filterTimeout;

    function updateFilter(col, value) {
        if (filterTimeout) {
            clearTimeout(filterTimeout);
        }

        // Look if already a filter exists
        var existingFilter = $filter('filter')(vm.filters, {field: col.key});

        if (value) {
            // Define new filter
            var currentFilter = col.buildFilterValue(value);

            if (existingFilter.length > 0) {
                console.log(vm.filters.indexOf(existingFilter[0]));
                console.log(currentFilter);
                vm.filters[vm.filters.indexOf(existingFilter[0])] = currentFilter;
            } else {
                vm.filters.push(currentFilter);
            }
        } else if (existingFilter.length > 0) {
            vm.filters.splice(vm.filters.indexOf(existingFilter), 1);
        }

        filterTimeout = setTimeout(function () {
            updateListContent();
        }, 300);
    }

    function toggleSelection(row) {
        if (row.selected) {
            row.selected = false;
            vm.selectedRows.splice(vm.selectedRows.indexOf(row), 1);
        } else {
            row.selected = true;
            vm.selectedRows.push(row);
        }
    }

    function toggleAllSelection() {
        var newState = false;
        if (vm.selectionAllSelected) {
            newState = true;
        }

        vm.selectedRows = [];
        _.forEach(vm.listItems, function (row) {
            row.selected = newState;
            if (newState) {
                vm.selectedRows.push(row);
            }
        })
    }
}