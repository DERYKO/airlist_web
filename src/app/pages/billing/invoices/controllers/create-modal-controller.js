/**
 * @ngdoc object
 * @name billing.invoices.controller:InvoicesCreateModalCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoices')
    .controller('InvoicesCreateModalCtrl', [
        'Contact',
        'InvoiceTemplate',
        'contactId',
        'type',
        '$scope',
        'closeFunction',
        'Invoice',
        '$q',
        'NumberCircle',
        'SweetAlert',
        'Error',
        '$rootScope',
        CreateModalCtrl
    ]);

function CreateModalCtrl(Contact, InvoiceTemplate, contactId, type, $scope, closeFunction, Invoice, $q, NumberCircle, SweetAlert, Error, $rootScope) {
    const vm = this;

    vm.positions = [];
    vm.template = {};
    vm.type = type;
    vm.contact = false;
    vm.blockSubmit = false;

    vm.model = {
        contact_id: contactId,
        type: type,
        performance_period: ''
    };
    vm.invoiceTemplates = [];
    vm.invoiceTypes = [
        'invoice',
        'bid',
        'cancellation'
    ];
    vm.address_type = 'last_document';
    vm.addressFromLastDocument = '';
    vm.addressEditable = false;
    vm.numberCircles = [];

    vm.close = close;
    vm.save = save;

    vm.addPosition = addPosition;
    vm.removePosition = removePosition;

    init();

    function init() {
        loadOpenPositions();
        loadContact();
        loadInvoiceTemplates();
        loadNumberCircles();
        initWatchers();
    }

    function loadContact() {
        Contact.one(contactId).get({include: 'invoices'}).then(function (contact) {
            vm.contact = contact.plain();
            if (vm.contact.invoices.data.length > 0) {
                vm.addressFromLastDocument = vm.contact.invoices.data[0].address;
            } else {
                vm.address_type = 'preferred'
            }
            updateAddress(vm.address_type);
        });
    }

    function loadNumberCircles() {
        NumberCircle.getList().then(function (circles) {
            vm.numberCircles = [];
            _.forEach(circles, function (v, k) {
                vm.numberCircles.push({
                    id: v.id,
                    title: v.title
                });
            });

            vm.model.number_circle_id = vm.numberCircles[0].id;
        });
    }

    function loadOpenPositions() {
        var curOrder = 1;
        Contact.one(contactId).all('positions/open/' + vm.model.type).getList().then(function (collection) {
            _.forEach(collection, function (v, k) {
                var elem = v.plain();
                elem.order = curOrder++;
                if (elem.type === 'position_link') {
                    elem.position_link_id = elem.id;
                    elem.parent_invoice_position_id = elem.invoice_position_id;
                    delete elem.invoice_position_id;
                } else if (elem.type === 'invoice_position') {
                    elem.parent_invoice_position_id = elem.id;
                } else {
                    return;
                }

                elem.editable = false;
                delete elem.id;
                vm.positions.push(elem);
            });
        });
    }

    function loadInvoiceTemplates() {
        InvoiceTemplate.getList().then(function (collection) {
            _.forEach(collection, function (v, k) {
                vm.invoiceTemplates.push(v.plain());
            });
        });
    }

    function initWatchers() {
        $scope.$watch('vm.template', function (value) {
            vm.model.invoice_template_id = value.id;
            var fieldsToCopyFromTemplate = [
                'subject',
                'number_circle_id',
                'text1',
                'text2',
                'text3',
                'tax_rate'
            ];

            for (var i = 0; i < fieldsToCopyFromTemplate.length; i++) {
                var fieldName = fieldsToCopyFromTemplate[i];

                vm.model[fieldName] = vm.template[fieldName];
            }
        });

        $scope.$watch('vm.address_type', function (value) {
            updateAddress(value);
        });
    }

    function updateAddress(value) {
        vm.addressEditable = (value === 'custom');

        if (!vm.contact) {
            return;
        }

        if (value === 'last_document') {
            vm.model.address = vm.addressFromLastDocument;
        } else if (value !== 'custom') {
            var addressPrefix;
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

            var address = '';
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

            var countryName = '';
            var currentCountryCode = vm.contact[addressPrefix + 'country'].toUpperCase();
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

    function close() {
        closeFunction();
    }

    function save() {
        vm.blockSubmit = true;
        Contact.one(contactId).all('invoice').post(vm.model).then(function (invoice) {
            var invoiceRequest = Invoice.one(invoice.id),
                positionRequests = [];

            for (var i = 0; i < vm.positions.length; i++) {
                var curPosition = vm.positions[i];

                positionRequests.push(invoiceRequest.customPOST(curPosition, 'positions'));
            }

            $q.all(positionRequests).then(function () {
                invoiceRequest.customGET('finish').then(function () {
                    SweetAlert.success('Created', 'Invoice was created');
                    close();
                    vm.blockSubmit = false;
                });
            }, function (e) {
                Error.checkError(e);
                vm.blockSubmit = false;
            });
        }, function (e) {
            Error.checkError(e);
            vm.blockSubmit = false;
        });
    }

    function addPosition() {
        var maxOrder = 0;
        for (var i = 0; i < vm.positions.length; i++) {
            if (vm.positions[i].order > maxOrder) {
                maxOrder = vm.positions[i].order;
            }
        }

        vm.positions.push({
            order: parseInt(maxOrder) + 1,
            amount: 0,
            price_per_unit: 0,
            editable: true
        });
    }

    function removePosition(position) {
        vm.positions.splice(vm.positions.indexOf(position), 1);
    }
}