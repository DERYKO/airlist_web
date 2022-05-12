/**
 * @ngdoc object
 * @name billing.invoices.controller:InvoicesEditModalCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoices')
    .controller('InvoicesEditModalCtrl', [
        'Contact',
        'InvoiceTemplate',
        'contactId',
        'invoice',
        '$scope',
        '$q',
        'NumberCircle',
        'SweetAlert',
        '$rootScope',
        '$filter',
        '$uibModalInstance',
        EditModalCtrl
    ]);

function EditModalCtrl(Contact, InvoiceTemplate, contactId, invoice, $scope, $q, NumberCircle, SweetAlert, $rootScope, $filter, $uibModalInstance) {
    const vm = this;

    vm.template = {};
    vm.contact = false;
    vm.blockSubmit = false;
    vm.model = invoice;
    vm.invoiceTemplates = [];
    vm.invoiceTypes = [
        'invoice',
        'bid',
        'cancellation'
    ];
    vm.subscriptionInvoiceData = null;
    vm.address_type = 'custom';
    vm.numberCircles = [];
    vm.addressEditable = false;

    vm.activePositions = [];
    vm.openPositions = [];
    vm.positionsToCreate = [];
    vm.positionsToDelete = [];

    vm.close = close;
    vm.save = save;

    init();

    function init() {
        if (vm.model.contactSubscription && vm.model.contactSubscription.invoice) {
            vm.subscriptionInvoiceData = vm.model.contactSubscription.invoice;
        }
        initWatchers();
    }

    function initWatchers() {
        // $scope.$watch('vm.template', function (value) {
        //     if (!value.id || value.id === vm.model.invoice_template_id) {
        //         return;
        //     }
        //     vm.model.invoice_template_id = value.id;
        //     var fieldsToCopyFromTemplate = [
        //         'subject',
        //         'text1',
        //         'text2',
        //         'text3',
        //         'tax_rate'
        //     ];
        //
        //     for (var i = 0; i < fieldsToCopyFromTemplate.length; i++) {
        //         var fieldName = fieldsToCopyFromTemplate[i];
        //
        //         vm.model[fieldName] = vm.template[fieldName];
        //     }
        // });

        $scope.$watch('vm.address_type', function (value) {
            updateAddress(value);
        });
    }

    function updateAddress(value) {
        vm.addressEditable = (value === 'custom');

        if (!vm.contact) {
            return;
        }

        if (value !== 'custom') {
            let addressPrefix;
            switch (value) {
                case 'preferred':
                    addressPrefix = 'preferred_';
                    break;
                case 'private':
                    addressPrefix = '';
                    break;
                case 'business':
                    addressPrefix = 'business_';
                    break;
            }

            let address = '';
            if (value === 'business' || (value === 'preferred' && vm.contact.business_preferred)) {
                address += (vm.contact.company_name).trim();
                if (address !== '') {
                    address += "\n";
                }
                address += 'z. H. ' + (vm.contact.title + ' ' + vm.contact.first_name + ' ' + vm.contact.last_name).trim() + "\n";
            } else {
                address += (vm.contact.title + ' ' + vm.contact.first_name + ' ' + vm.contact.last_name).trim() + "\n";
            }

            address += vm.contact[addressPrefix + 'street'] + "\n";
            address += vm.contact[addressPrefix + 'zip'] + ' ' + vm.contact[addressPrefix + 'city'] + "\n";

            let countryName = '',
                currentCountryCode = vm.contact[addressPrefix + 'country'];

            if (currentCountryCode) {
                currentCountryCode = currentCountryCode.toUpperCase();
            }
            _.forEach($rootScope.deposit.countries, function (country) {
                if (country.code === currentCountryCode) {
                    countryName = country.name;
                }
            });
            address += (countryName + "\n").trim();

            vm.model.address = address;
        }
    }

    function close(dataToClose) {
        if (dataToClose) {
            $uibModalInstance.close(dataToClose);
        } else {
            $uibModalInstance.dismiss();
        }
    }

    function save() {
        vm.blockSubmit = true;
        let jobsToWaitFor = [];
        // _.forEach(vm.positionsToDelete, function (posToDelete) {
        //     if (typeof posToDelete.id !== 'undefined') {
        //         jobsToWaitFor.push(invoice.customDELETE('positions/' + posToDelete.id));
        //     }
        // });
        //
        // _.forEach(vm.positionsToCreate, function (posToCreate) {
        //     if (typeof posToCreate.id === 'undefined') {
        //         if (typeof posToCreate.position_link !== 'undefined') {
        //             delete posToCreate.position_link;
        //         }
        //         jobsToWaitFor.push(invoice.customPOST(posToCreate, 'positions'));
        //     }
        // });
        //
        // _.forEach(vm.activePositions, function (posToUpdate) {
        //     if (typeof posToUpdate.id !== 'undefined') {
        //         var dataToSend = _.cloneDeep(posToUpdate);
        //         if (typeof dataToSend.position_link !== 'undefined') {
        //             delete dataToSend.position_link;
        //         }
        //         if ((typeof dataToSend.position_link_id !== 'undefined' && dataToSend.position_link_id) || (typeof dataToSend.parent_invoice_position_id !== 'undefined' && dataToSend.parent_invoice_position_id)) {
        //             dataToSend = {
        //                 order: posToUpdate.order
        //             };
        //         }
        //         jobsToWaitFor.push(invoice.customPUT(dataToSend, 'positions/' + posToUpdate.id));
        //     }
        // });


        if (vm.subscriptionInvoiceData) {
            vm.model.subscription_invoice = {};
            vm.model.subscription_invoice.start_date = vm.subscriptionInvoiceData.start_date;
            vm.model.subscription_invoice.end_date = vm.subscriptionInvoiceData.end_date;
            vm.model.performance_period = $filter('date')(vm.subscriptionInvoiceData.start_date, 'dd. MM. yyyy') + ' - ' + $filter('date')(vm.subscriptionInvoiceData.end_date, 'dd. MM. yyyy');
        }

        jobsToWaitFor.push(invoice.put());

        $q.all(jobsToWaitFor).then(function (result) {
            SweetAlert.success('Success', 'Changes have been saved successful');
            close();
            vm.blockSubmit = false;
        }, function (error) {
            SweetAlert.error('Error while saving', 'Please reopen the document and check the data');
            vm.blockSubmit = false;
            close();
        });
    }

    // @todo out of init function
    // initPositions();
    // loadOpenPositions();
    // loadContact();
    // loadInvoiceTemplates();
    // loadNumberCircles();

    // vm.addPosition = addPosition;
    // vm.removePosition = removePosition;
    // vm.usePosition = usePosition;
    // vm.refactorOrder = refactorOrder;

    // function initPositions() {
    //     vm.activePositions = [];
    //     _.forEach(vm.model.positions.data.plain(), function (v) {
    //         v.editable = (v.position_link_id === null && v.parent_invoice_position_id === null);
    //         vm.activePositions.push(v);
    //     });
    // }
    //
    // function loadContact() {
    //     Contact.one(contactId).get().then(function (contact) {
    //         vm.contact = contact.plain();
    //         updateAddress(vm.address_type);
    //     });
    // }
    //
    // function loadNumberCircles() {
    //     NumberCircle.getList().then(function (circles) {
    //         vm.numberCircles = [];
    //         _.forEach(circles, function (v, k) {
    //             vm.numberCircles.push({
    //                 id: v.id,
    //                 title: v.title
    //             });
    //         });
    //     });
    // }
    //
    // function loadOpenPositions() {
    //     vm.openPositions = [];
    //     _.forEach(vm.positionsToDelete, function (v, k) {
    //         if (v.position_link_id) {
    //             vm.openPositions.push(v);
    //         }
    //     });
    //
    //     Contact.one(contactId).all('positions/open/' + vm.model.type).getList().then(function (collection) {
    //         _.forEach(collection, function (v, k) {
    //             var elem = v.plain();
    //             if ($filter('filter')(vm.activePositions, {position_link_id: elem.id}).length === 0) {
    //                 if (elem.type === 'position_link') {
    //                     elem.position_link_id = elem.id;
    //                     elem.parent_invoice_position_id = elem.invoice_position_id;
    //                     delete elem.invoice_position_id;
    //                 } else if (elem.type === 'invoice_position') {
    //                     elem.parent_invoice_position_id = elem.id;
    //                 } else {
    //                     return;
    //                 }
    //                 elem.editable = false;
    //                 delete elem.id;
    //                 vm.openPositions.push(elem);
    //             }
    //         });
    //     });
    //
    // }
    //
    // function loadInvoiceTemplates() {
    //     InvoiceTemplate.getList().then(function (collection) {
    //         _.forEach(collection, function (v, k) {
    //             var curTemplate = v.plain();
    //             vm.invoiceTemplates.push(curTemplate);
    //             if (curTemplate.id === vm.model.invoice_template_id) {
    //                 vm.template = curTemplate;
    //             }
    //         });
    //     });
    // }

    // function refactorOrder() {
    //     vm.activePositions.sort(function compare(a, b) {
    //         if (a.order === b.order) {
    //             return 0;
    //         }
    //
    //         return (a.order < b.order) ? -1 : 1;
    //     });
    //
    //     var curOrderPos = 1;
    //     _.forEach(vm.activePositions, function (v) {
    //         v.order = curOrderPos++;
    //     });
    // }

    // function addPosition() {
    //     var maxOrder = 0;
    //     for (var i = 0; i < vm.activePositions.length; i++) {
    //         if (vm.activePositions[i].order > maxOrder) {
    //             maxOrder = vm.activePositions[i].order;
    //         }
    //     }
    //
    //     var position = {
    //         order: parseInt(maxOrder) + 1,
    //         amount: 0,
    //         price_per_unit: 0,
    //         editable: true
    //     };
    //     vm.activePositions.push(position);
    //     vm.positionsToCreate.push(position);
    //     refactorOrder();
    // }
    //
    // function removePosition(position) {
    //     vm.activePositions.splice(vm.activePositions.indexOf(position), 1);
    //
    //     refactorOrder();
    //
    //     if (typeof position.id !== 'undefined') {
    //         vm.positionsToDelete.push(position);
    //     }
    //
    //     var createIndex = vm.positionsToCreate.indexOf(position);
    //     if (createIndex > -1) {
    //         vm.positionsToCreate.splice(createIndex, 1);
    //     }
    //
    //     if (typeof position.position_link_id || typeof position.parent_invoice_position_id) {
    //         loadOpenPositions();
    //     }
    // }
    //
    // function usePosition(position) {
    //     var maxOrder = 0;
    //     for (var i = 0; i < vm.activePositions.length; i++) {
    //         if (vm.activePositions[i].order > maxOrder) {
    //             maxOrder = vm.activePositions[i].order;
    //         }
    //     }
    //     position.order = maxOrder + 1;
    //     vm.activePositions.push(position);
    //     var index = vm.positionsToDelete.indexOf(position);
    //     if (index > -1) {
    //         vm.positionsToDelete.splice(index, 1);
    //     }
    //
    //     if (typeof position.id === 'undefined') {
    //         vm.positionsToCreate.push(position);
    //     }
    //
    //     refactorOrder();
    //     loadOpenPositions();
    // }
}