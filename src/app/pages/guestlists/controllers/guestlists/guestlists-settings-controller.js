/**
 * @ngdoc object
 * @name guestlists.controller:GuestlistsSettingsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .controller('GuestlistsSettingsCtrl', [
        'Guestlist',
        'locale',
        '$q',
        '$state',
        '$stateParams',
        'Alert',
        'Workflows',
        'SelectBox',
        'NavService',
        GuestlistsSettingsCtrl
    ]);

function GuestlistsSettingsCtrl(Guestlist, locale, $q, $state, $stateParams, Alert, Workflows, SelectBox, NavService) {
    const vm = this;

    vm.edit = edit;
    vm.hide = hide;
    vm.archive = archive;
    vm.restore = restore;
    vm.delete = forceDelete;
    vm.selectTemplates = selectTemplates;
    vm.removeTemplate = removeTemplate;

    init();

    function init() {
        console.log('test');
        Guestlist.one($stateParams.gid).get({include: 'templates'}).then(function (record) {
            vm.model = record;
            Guestlist.getCustom(vm.model);
            vm.workflows = Workflows.getWorkflows('guestlist::settings');
            this.setGoBackAction();
            return record;
        }, function () {
            Alert.error(locale.getString('guestlists.guestlist_not_found'), locale.getString('guestlists.guestlist_not_found_message'));
        });
    }

    function edit() {
        $state.go('app.guestlists.rsvps.edit-settings', {gid: vm.model.id, guestlist: vm.model});
    }

    function hide() {
        $state.go('app.guestlists.rsvps.index', {gid: vm.model.id, guestlist: vm.model});
    }

    function restore(model) {
        Alert.confirm({
            title: locale.getString('sweetalerts.confirm_restore'),
            text: locale.getString('guestlists.confirm_restore'),
            type: 'warning',
            wait: true,
            confirmBtn: locale.getString('sweetalerts.yes_restore'),
        }).then(() => {
            model.restore().then(function (model) {
                Alert.success(locale.getString('sweetalerts.restore_successful'), locale.getString('guestlists.restore_successful'));
                vm.model = model;
            }, response => Alert.handle(response))
        }, response => Alert.handle(response));
    }

    function forceDelete(model) {
        Alert.confirm({
            title: locale.getString('sweetalerts.confirm_force_delete'),
            text: locale.getString('guestlists.confirm_force_delete'),
            type: 'warning',
            wait: true,
            confirmBtn: '#ed5565',
        }).then(() => {
            model.forceDelete().then(function () {
                $state.go('app.guestlists.index');
                Alert.success(locale.getString('sweetalerts.force_delete_successful'), locale.getString('guestlists.force_delete_successful'));
            }, response => Alert.handle(response))
        }, response => Alert.handle(response));
    }

    function archive() {
        Alert.confirm({
            title: locale.getString('sweetalerts.confirm_archive'),
            text: locale.getString('guestlists.confirm_archive'),
            type: 'warning',
            wait: true,
            confirmBtn: '#ed5565',
        }).then(() => {
            vm.model.doDELETE().then(function (model) {
                Alert.success(locale.getString('sweetalerts.archive_successful'), locale.getString('guestlists.archive_successful'));
                vm.model = model;
                vm.onArchive({category: vm.model});
            }, response => Alert.handle(response))
        }, response => Alert.handle(response));
    }

    function selectTemplates() {
        //@todo refactor
        // SelectBox.template(false).then(function (response) {
        //     console.log(response);
        //     Guestlist.addTemplatesToGuestlist(vm.model, response.keys.items).then(function () {
        //         Alert.success(locale.getString('guestlists.templates_added'), locale.getString('guestlists.templates_added_message'));
        //         init();
        //     });
        // });
    }

    function removeTemplate(template) {
        Guestlist.removeTemplatesFromGuestlist(vm.model, template.id).then(function () {
            Alert.success(locale.getString('guestlists.template_removed'), locale.getString('guestlists.template_removed_message'));
            init();
        });
    }
}
