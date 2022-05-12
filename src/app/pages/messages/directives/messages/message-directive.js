import template from './message-directive.tpl.html';


/**
 * @ngdoc directive
 * @name messages.directive:message
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module='messages'>
 <file name='index.html'>
 <message model=''></message>
 </file>
 </example>
 *
 */
angular
    .module('airlst.messages')
    .directive('messageDetails', message);

function message() {
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'message',
        controller: [
            'locale',
            '$sce',
            '$state',
            'SweetAlert',
            MessageCtrl
        ],
        bindToController: {
            model: '=',
            manager: '=',
            onHide: '&',
            onRefreshParent: '&',
            onRefreshArchived: '&'
        }
    };
}

function MessageCtrl(locale, $sce, $state, SweetAlert) {
    var vm = this;
    vm.name = locale.getString('messages.title_details');
    vm.noMessage = false;

    vm.hide = hide;
    vm.delete = forceDelete;
    vm.archive = archiveMessage;
    vm.restore = restoreMessage;
    vm.getContentView = getContentView;

    function getContentView() {
        if (vm.model.content) {
            return trustTemplateHtml(vm.model.content);
        }

        if (!_.isUndefined(vm.model.template)) {
            return trustTemplateHtml(vm.model.template.data.html);
        } else {
            vm.noMessage = true;
        }
    }

    function trustTemplateHtml(string) {
        return $sce.trustAsHtml(string);
    }

    function hide() {
        var data = {};
        if (vm.manager) {
            data = {
                notify: false,
                reload: false,
                location: true
            };
        }
        $state.go('app.messages.index', {}, data);
        vm.onHide();
    }

    function restoreMessage() {
        SweetAlert.swal({
                title: locale.getString('sweetalerts.confirm_restore'),
                text: locale.getString('messages.confirm_restore'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('sweetalerts.yes_restore'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    vm.model.restore().then(function (model) {
                        SweetAlert.swal(locale.getString('sweetalerts.restore_successful'), locale.getString('messages.restore_successful'), 'success');
                        vm.model = model;
                        vm.onRefreshArchived();
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.restore_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }

    function forceDelete() {
        SweetAlert.swal({
                title: locale.getString('sweetalerts.confirm_force_delete'),
                text: locale.getString('messages.confirm_force_delete'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('sweetalerts.yes_force_delete'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    vm.model.forceDelete().then(function () {
                        SweetAlert.swal(locale.getString('sweetalerts.force_delete_successful'), locale.getString('messages.force_delete_successful'), 'success');
                        vm.onRefreshArchived();
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.force_delete_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }

    function archiveMessage() {
        SweetAlert.swal({
                title: locale.getString('sweetalerts.confirm_archive'),
                text: locale.getString('messages.confirm_archive'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('sweetalerts.yes_archive'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    vm.model.remove().then(function () {
                        SweetAlert.swal(locale.getString('sweetalerts.archive_successful'), locale.getString('messages.archive_successful'), 'success');
                        vm.onRefreshParent();
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.archive_not_successful'), response.data.message, 'error');
                    });
                }
            });

    }
}
