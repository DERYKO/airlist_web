import template from './ticket-directive.tpl.html';

/**
 * @ngdoc directive
 * @name tickets.directive:ticket
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module='tickets'>
 <file name='index.html'>
 <ticket model=''></ticket>
 </file>
 </example>
 *
 */
angular
    .module('airlst.tickets')
    .directive('ticket', ticket);

function ticket() {
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'ticket',
        controller: [
            'Error',
            'Ticket',
            'locale',
            '$q',
            '$state',
            'SweetAlert',
            'ResourceSelect',
            'ResourceCommon',
            TicketCtrl
        ],
        bindToController: {
            model: '=',
            manager: '=',
            onHide: '&',
            onDelete: '&',
            onRestore: '&',
            onArchive: '&'
        }
    };
}

function TicketCtrl(Error, Ticket, locale, $q, $state, SweetAlert, ResourceSelect, ResourceCommon) {
    var vm = this;
    vm.name = locale.getString('tickets.title_details');
    vm.editing = false;

    vm.save = save;
    vm.hide = hide;
    vm.restore = restore;
    vm.delete = forceDelete;
    vm.archive = archive;
    vm.cancelEditing = cancelEditing;
    vm.attachToTemplate = attachToTemplate;

    init();

    function init() {
        Ticket.getSchema().then(function (schema) {
            vm.schema = schema;
        });

        vm.form = Ticket.getForm();
    }

    function save(model) {
        model.save().then(function (newModel) {
            var deferred = newModel, data;
            if (model.background_image && !_.isString(model.background_image)) {

                data = {model: 'ticket', field: 'background_image', img: model.background_image, items: [newModel.id]};
                deferred = ResourceCommon.uploadImage(data).then(function (response) {
                    newModel.background_image = response[0];
                    return newModel;
                });
            }
            $q.resolve(deferred).then(function (model) {
                vm.model = model;
            });

        }, function (response) {
            Error.checkError(response);
        });
    }

    function cancelEditing() {
        vm.editing = false;
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
        $state.go('app.tickets.index', {}, data);
        vm.onHide();
    }

    function restore(model) {
        SweetAlert.swal({
                title: locale.getString('common.confirm_restore'),
                text: locale.getString('tickets.confirm_restore'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('common.yes_restore'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    model.restore().then(function (model) {
                        SweetAlert.swal(locale.getString('common.restore_successful'), locale.getString('tickets.restore_successful'), 'success');
                        vm.onRestore({ticket: model});
                    }, function (response) {
                        SweetAlert.swal(locale.getString('common.restore_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }

    function forceDelete(model) {
        SweetAlert.swal({
                title: locale.getString('common.confirm_force_delete'),
                text: locale.getString('tickets.confirm_force_delete'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('common.yes_force_delete'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    model.forceDelete().then(function () {
                        vm.onDelete({ticket: vm.model});
                        SweetAlert.swal(locale.getString('common.force_delete_successful'), locale.getString('tickets.force_delete_successful'), 'success');
                    }, function (response) {
                        SweetAlert.swal(locale.getString('common.force_delete_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }

    function archive() {
        SweetAlert.swal({
                title: locale.getString('common.confirm_archive'),
                text: locale.getString('tickets.confirm_archive'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('common.yes_archive'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    vm.model.doDELETE().then(function (model) {
                        SweetAlert.swal(locale.getString('common.archive_successful'), locale.getString('tickets.archive_successful'), 'success');
                        vm.model = model;
                        vm.onArchive({ticket: vm.model});
                    }, function (response) {
                        SweetAlert.swal(locale.getString('common.archive_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }

    function attachToTemplate() {
        ResourceSelect.template(true).then(function (response) {
            response.ticket_id = vm.model.id;
            response.save().then(function () {
                SweetAlert.swal(locale.getString('tickets.tickets_attached'), locale.getString('tickets.tickets_attached_message'), 'success')
            });
        }, function (response) { //handle cancel in select box

        });
    }
}
