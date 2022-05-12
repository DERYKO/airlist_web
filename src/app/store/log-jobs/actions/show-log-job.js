import template from '../../views/log-jobs-details-modal.html';
/**
 * @ngdoc service
 * @name checkins.factory:showLogJob
 *
 * @description
 *
 */
angular
    .module('airlst.logJobs')
    .factory('showLogJob', [
        '$q',
        '$uibModal',
        showLogJob
    ]);

function showLogJob($q, $uibModal) {
    return {
        key: 'show-log-job',
        title: 'Job Details',
        level: 'row',
        class: 'btn btn-default btn-sm',
        action: function (logJob) {
            var $modalInstance = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: template,
                controller: [
                    'BootstrapAdapter',
                    'LogJob',
                    'selectedLogJob',
                    'StateManager',
                    '$uibModalInstance',
                    modalController
                ],
                controllerAs: 'vm',
                resolve: {
                    selectedLogJob: function () {
                        return logJob;
                    }
                }
            });

            return $modalInstance.result.then(function () {
                console.log('reached this');
            }, function (response) {
                return $q.reject(response);
            });
        }
    }
}

function modalController(BootstrapAdapter, LogJob, selectedLogJob, StateManager, $uibModalInstance) {
    var vm = this;
    vm.logJob = selectedLogJob;

    vm.close = close;

    vm.children_manager = StateManager.getManager('ChildrenJobsListView');

    LogJob.for(vm.logJob.id).getColumns().then(function (columns) {
        columns.map(function (col) {
            col.visible = _.indexOf(['job_id', 'job_name', 'status', 'item_id', 'reason'], col.field) > -1;
            return col;
        });
        vm.children_manager.updateColumns(columns);
        return columns;
    });


    vm.children_manager
        .setController(vm)
        .setTitle('Child Processes')
        .setModel(LogJob.for(vm.logJob.id))
        .setAdapter(BootstrapAdapter.getAdapter())
        .buildView()
        .then(function (adapter) {
            vm.children_adapter = adapter;
        });

    function close() {
        $uibModalInstance.dismiss('cancel');
    }
}