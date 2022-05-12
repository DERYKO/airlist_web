import selectOrCreateRsvpModalTemplate from '../../views/select-or-create-rsvp-modal.tpl.html';
import rsvpsEditorTemplate from '../../../pages/guestlists/views/rsvps-create.tpl.html';
import selectPassBookModalTemplate from '../../views/select-passbook-model-modal.tpl.html';
import selectStatusModalTemplate from './views/selected-status-modal.tpl.html';
import SelectStatusModalController from './controllers/select-status-modal-controller';

/**
 * @ngdoc service
 * @name components.service:SelectBox
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .service('ResourceSelect', [
        'SelectBox',
        'Contact',
        'Rsvp',
        'Picklist',
        'Guestlist',
        'Category',
        'Template',
        'Ticket',
        '$q',
        '$uibModal',
        '$injector',
        'Contacts',
        'Rsvps',
        'Guestlists',
        ResourceSelect
    ]);

function ResourceSelect(SelectBox, Contact, Rsvp, Picklist, Guestlist, Category, Template, Ticket, $q, $uibModal, $injector, Contacts, Rsvps, Guestlists) {
    const service = this;

    service.contact = function (single) {
        const store = Contacts.reset({
            persist: false,
            listname: 'ResourceSelectContactsListView'
        }), config = {
                displayField: 'full_name'
        };

        if (single) {
            return SelectBox.single(store, config);
        }

        return SelectBox.multiple(store, config);
    };

    service.rsvp = function (single) {
        return new Promise(function(resolve, reject) {
            service.guestlist(true).then(function(data) {
                const store = Rsvps.create('ResourceSelectRsvpsListView').reset({
                    persist: false,
                    listname: 'ResourceSelectRsvpsListView'
                }), config = {
                        displayField: 'contact.full_name'
                };

                store.commit('setPrefix', 'guestlists/' + data.data);

                if (single) {
                    return SelectBox.single(store, config).then(function(data){
                        resolve(data);
                    }, function() {
                        reject();
                    });
                }

                return SelectBox.multiple(store, config).then(function(data){
                    resolve(data);
                }, function() {
                    reject();
                });
            }, function(err){
                reject();
            });
        });
    };
    service.newOrExistingRsvp = function (guestlist) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: selectOrCreateRsvpModalTemplate,
            resolve: {
                selector: service,
                guestlist: guestlist
            },
            controllerAs: 'vm',
            controller: function (guestlist, selector, quickAddContact, ResourceSelect, $uibModalInstance) {
                var vm = this;
                vm.selected = {};

                vm.close = function () {
                    $uibModalInstance.dismiss();
                };

                vm.addContact = function () {
                    return quickAddContact.action({guestlist: guestlist})
                        .then(function (rsvp) {
                            $uibModalInstance.close(rsvp);
                        });
                };


                vm.makeBooking = function () {
                    return ResourceSelect.contact(true)
                        .then(function (contact) {
                            var factory = Rsvp.setGuestlist(guestlist);

                            $uibModal
                                .open({
                                    animation: true,
                                    size: 'md',
                                    templateUrl: rsvpsEditorTemplate,
                                    resolve: {
                                        factory: factory
                                    },
                                    controller: function (factory, $uibModalInstance) {
                                        var vm = this;

                                        vm.factory = factory;

                                        vm.parent_rsvp_config = {
                                            items: vm.factory.getRsvps(),
                                            model: vm.factory.getModel(),
                                            settings: {}
                                        };
                                        vm.save = function (model) {
                                            console.log(model);
                                            $uibModalInstance.close(model);
                                        }

                                        vm.closeView = function () {
                                            $uibModalInstance.dismiss();
                                        }
                                    },
                                    controllerAs: 'vm'
                                })
                                .result
                                .then(function (model) {
                                    model.contact_id = contact.id;
                                    model.guestlist_id = guestlist.id;
                                    model.status = model.status ? model.status : 'listed';
                                    return factory.post(model).then(function (rsvp) {
                                        $uibModalInstance.close(rsvp);
                                    });
                                });
                        });
                };

                vm.selectRsvp = function () {
                    return selector.rsvp(guestlist, true).then(function (rsvp) {
                        $uibModalInstance.close(rsvp);
                    });
                }
            }
        });

        return modalInstance.result;
    };
    service.selectRsvpOrContactModal = function (title) {
        const modalInstance = $uibModal.open({
            animation: true,
            templateUrl: selectPassBookModalTemplate,
            resolve: {
                selector: service
            },
            controllerAs: 'vm',
            controller: [
                'selector',
                '$uibModalInstance',
                function (selector, $uibModalInstance) {
                    const vm = this;
                    vm.title = title;
                    vm.selected = {};

                    vm.close = function () {
                        $uibModalInstance.dismiss();
                    };

                    vm.selectContact = function () {
                        vm.selected.type = 'contact';
                        selector.contact(true).then(function (result) {
                            vm.selected.id = result.data;
                            $uibModalInstance.close(vm.selected);
                        });
                    };

                    vm.selectRsvp = function () {
                        vm.selected.type = 'rsvp';
                        selector.rsvp(true).then(function (result) {
                            vm.selected.id = result.data;
                            $uibModalInstance.close(vm.selected);
                        });
                    }
                }
            ]
        });

        return modalInstance.result;
    };

    service.picklist = function () {
        return SelectBox.multiple(Picklist, {});
    };

    service.guestlist = function (single, filters) {
        const store = Guestlists.reset({
            persist: false,
            listname: 'ResourceSelectGuestlistsListView'
        }), config = {
                displayField: 'name'
        };

        // @todo reimplement filters

        if (single) {
            return SelectBox.single(store, config);
        }

        return SelectBox.multiple(store, config);
    };

    service.category = function () {
        return SelectBox.multiple(Category, {});
    };

    service.ticket = function () {
        return SelectBox.get({model: Ticket});
    };

    service.template = function (single) {
        if (single) {
            return SelectBox.get({model: Template});
        }
        return SelectBox.multiple(Template, {});
    };

    service.selectStatus = function(preSelectedState) {
        return $uibModal.open({
            controller: SelectStatusModalController,
            controllerAs: 'vm',
            templateUrl: selectStatusModalTemplate,
            size: 'sm',
            resolve: {
                preSelectedState: () => {
                    return preSelectedState;
                }
            }
        }).result;
    };

    return service;
}
