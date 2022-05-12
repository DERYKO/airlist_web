/**
 * @ngdoc object
 * @name rsvps.controller:RsvpMultipleEditCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .controller('RsvpMultipleEditCtrl', [
        'Error',
        'guestlist',
        'locale',
        'manager',
        'Restangular',
        'rows',
        'Rsvp',
        '$state',
        'SweetAlert',
        '$uibModalInstance',
        RsvpMultipleEditCtrl
    ]);

function RsvpMultipleEditCtrl(Error, guestlist, locale, manager, Restangular, rows, Rsvp, $state, SweetAlert, $uibModalInstance) {

    var vm = this;
    vm.save = save;
    vm.closeView = closeView;
    vm.multiple = true;
    vm.guestlist = guestlist;
    vm.manager = manager;
    vm.rsvps = rows;
    vm.rsvp = {};
    vm.currentTab = 'booking';
    init();

    function init() {
        if (!vm.rsvps) {
            SweetAlert.error('You must first select rows before updating them');
            $state.go('app.guestlists.rsvps.index', {guestlist: vm.guestlist, gid: vm.guestlist.id});
        }
        setupEditor();
        vm.parent_rsvp_config = {
            items: vm.factory.getRsvps(),
            model: vm.factory.getModel(),
            settings: {}
        };
    }


    function setupEditor() {
        vm.factory = Rsvp.setGuestlist(vm.guestlist);
        vm.form = [];
        vm.factory.getForm().then(function (form) {
            vm.form = _.map(form, function (field) {
                field.required = false;
                return field;
            })
        });
    }

    function save(fields) {
        Restangular.one('guestlists/' + guestlist.id + '/rsvps').doPUT({
            fields: fields,
            keys: vm.rsvps
        }).then(function () {
            SweetAlert.swal(locale.getString('sweetalerts.records_saved'), locale.getString('sweetalerts.records_saved_message'), 'success');
            closeView();
        }, function (response) {
            Error.checkError(response);
        });
    }

    function closeView() {
        if (manager) {
            manager.refreshData().then(function () {
                manager.buildView();
            });
        }

        $uibModalInstance.dismiss('cancel');
    }
}