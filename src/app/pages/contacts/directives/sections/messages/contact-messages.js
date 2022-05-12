import templateUrl from './contact-messages.tpl.html';
import emailModalTemplate from './show-email-modal.tpl.html';

class ContactMessagesCtrl {

    constructor(Message, $injector, Messages) {
        this.model = Message;
        this.injector = $injector;
        this.store = Messages.reset({
            view: 'ContactMessagesListview',
            persist: false
        });
    }

    $onInit() {
        this.store.commit('setPermanentFilters', {'contact_extended.id': this.contact.id});
        this.store.commit('setVisible', [
            'subject',
            'status',
            'created_at'
        ]);
        this.store.commit('addAction', {
            key: 'details',
            text: 'Details',
            class: 'btn btn-info btn-simple btn-xs',
            icon: 'fa fa-search',
            level: 'row',
            action: this.showMessage
        });
        this.store.commit('addAction', {
            key: 'show_archived',
            title: 'Show deleted',
            level: 'settings',
            manager: 'showArchived'
        });
        this.store.commit('setVm', this);
    }

    showMessage(payload, store) {
        store.ng.injector.get('$uibModal').open({
            animation: true,
            size: 'lg',
            templateUrl: emailModalTemplate,
            controller: ['$sce', '$uibModalInstance', 'email', 'Message', function ($sce, $uibModalInstance, email, Message) {
                var vm = this;
                vm.message = email;
                Message.one(email.id).get({include: 'recipient,template'}).then(function (message) {
                    vm.message = message;
                    vm.content = $sce.trustAsHtml(vm.message.content);
                }, function (error) {
                });

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                }
            }],
            resolve: {
                email: function () {
                    return payload.row;
                }
            },
            controllerAs: 'email'
        });
    }

    archiveManyMessages(rows) {
        const model = this.model.one();
        model.items = [];

        rows.forEach(function (row) {
            model.items.push(row.id);
        });

        return SweetAlert.swal({
                title: locale.getString('sweetalerts.are_you_sure'),
                text: locale.getString('sweetalerts.archiving_records_confirmation_message'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('sweetalerts.yes_archive_selected'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    model.customDELETE().then(function () {
                        setupMessages();
                        SweetAlert.swal(locale.getString('sweetalerts.archive_successful'), locale.getString('sweetalerts.records_archived_message'), 'success');
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.saving_unsuccessful'), response.data.message, 'error');
                    });
                }
            });
    }

    restoreManyMessages(rows) {

        var items = [];

        rows.forEach(function (row) {
            items.push(row.id);
        });

        return SweetAlert.swal({
                title: locale.getString('sweetalerts.are_you_sure'),
                text: locale.getString('sweetalerts.restoring_records_confirmation_message'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('sweetalerts.yes_restore_selected'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    Message.restoreMany(items).then(function () {
                        setupMessages();
                        SweetAlert.swal(locale.getString('sweetalerts.restore_successful'), locale.getString('sweetalerts.records_restored_message'), 'success');
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.restore_unsuccessful'), response.data.message, 'error');
                    });
                }
            });
    }

    deleteManyMessages(rows) {

        var items = [];

        rows.forEach(function (row) {
            items.push(row.id);
        });

        return SweetAlert.swal({
                title: locale.getString('sweetalerts.are_you_sure'),
                text: locale.getString('sweetalerts.deleting_records_confirmation_message'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('sweetalerts.yes_delete_selected'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    Message.deleteMany(items).then(function () {
                        setupMessages();
                        SweetAlert.swal(locale.getString('sweetalerts.delete_successful'), locale.getString('sweetalerts.records_deleted_message'), 'success');
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.delete_unsuccessful'), response.data.message, 'error');
                    });
                }
            });
    }
}


ContactMessagesCtrl.$inject = ['Message', '$injector', 'Messages'];


angular
    .module('airlst.contacts')
    .component('contactMessages', {
        bindings: {
            contact: '='
        },
        controller: ContactMessagesCtrl,
        controllerAs: 'vm',
        templateUrl: templateUrl
    });

