/**
 * @ngdoc object
 * @name billing.invoices.controller:InvoicesCreateModalCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoices')
    .controller('InvoicesUpdateAddressModalCtrl', [
        'Contact',
        'contactId',
        'invoiceId',
        '$scope',
        'closeFunction',
        '$rootScope',
        'Invoice',
        '$http',
        'Env',
        'Error',
        'SweetAlert',
        UpdateAddressModalCtrl
    ]);

function UpdateAddressModalCtrl(Contact, contactId, invoiceId, $scope, closeFunction, $rootScope, Invoice, $http, Env, Error, SweetAlert) {
    const vm = this;

    vm.model = {
        address: ''
    };
    vm.contact = false;
    vm.address_type = 'custom';

    vm.close = close;
    vm.save = save;

    init();

    function init() {
        loadInvoice();
        loadContact();
        initWatchers();
    }

    function loadContact() {
        console.log(contactId);
        Contact.one(contactId).get().then(function (contact) {
            vm.contact = contact.plain();
        });
    }

    function loadInvoice() {
        Invoice.one(invoiceId).get().then(function (invoice) {
            vm.invoice = invoice.plain();
            vm.model.address = _.cloneDeep(vm.invoice.address);
        });
    }

    function initWatchers() {
        $scope.$watch('vm.address_type', function (value) {
            updateAddress(value);
        });
    }

    function updateAddress(value) {
        vm.addressEditable = (value === 'custom');

        if (!vm.contact) {
            return;
        }

        console.log(vm.contact);

        if (value === 'last_document') {
            vm.model.address = vm.addressFromLastDocument;
        } else if (value !== 'custom') {
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
            } else if (value === 'shipping' && vm.contact.shipping_company_name !== '') {
                address += (vm.contact.shipping_company_name).trim();
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
        $http.put(Env.apiUrl.concat('/billing/invoices/', vm.invoice.id, '/address'), {
            address: vm.model.address
        }).then(function () {
            SweetAlert.success('update', 'address updated successfully');
            closeFunction();
        }, function (error) {
            Error.default(error);
        });
    }
}