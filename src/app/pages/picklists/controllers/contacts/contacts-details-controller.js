/**
 * @ngdoc object
 * @name picklists.controller:PicklistCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .controller('PicklistContactDetailsCtrl', [
        'Contact',
        '$stateParams',
        PicklistContactsCtrl
    ]);

function PicklistContactsCtrl(Contact, $stateParams) {
    var vm = this;

    init();
    function init() {
        loadContact();
        setupEditor();

        vm.backRoute = {
            path: 'app.picklists.contacts.index',
            params: {},
            data: {}
        };

        if ($stateParams.store) {
            vm.manager = $stateParams.store;
            vm.backRoute.data = {
                notify: false,
                reload: false,
                location: true
            };
        }
    }

    function loadContact() {
        if ($stateParams.contact) {
            vm.contact = $stateParams.contact;
        } else {
            vm.contact = Contact.one($stateParams.cid).get().then(function (contact) {
                vm.contact = contact;
                return contact;
            });
        }
    }

    function setupEditor() {
        Contact.getSchema().then(function (schema) {
            vm.schema = schema;
        });
    }
}
