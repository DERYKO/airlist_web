import CompanyModules from '../factories/modules-service';

/**
 * @ngdoc object
 * @name users.controller:UsersCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.users')
    .controller('UsersDetailsCtrl', [
        'locale',
        'Acl',
        '$rootScope',
        '$state',
        '$stateParams',
        'Alert',
        '$http',
        'NavService',
        UsersDetailsCtrl
    ]);

function UsersDetailsCtrl(locale, Acl, $rootScope, $state, $stateParams, Alert, $http, NavService) {
    const vm = this;

    vm.user = {};

    init();

    function init() {
        vm.modules = CompanyModules.getModules($rootScope.company.modules);
        vm.roles = $rootScope.company.roles;
        vm.store = $stateParams.store;

        locale.ready(['sweetalerts', 'common','users'])
            .then(() => {
                $http.get(`users/${ $stateParams.id}`).then(response => {
                    vm.user = response.data.data;
                    _updateCustomActions();
                });
            })
    }

    function _updateCustomActions() {
        NavService.setBreadcrumbParameters({
            user_name: vm.user.full_name
        });
        const customActions = [];
        if (Acl.hasRight('users::edit') && !vm.user.archived) {
            customActions.push({
                label: 'Edit',
                icon: 'pencil',
                order: 5,
                action() {
                    $state.go('app.users.edit', {
                        id: vm.user.id,
                        store: vm.store
                    });
                }
            });
        }
        if (Acl.hasRight('users::delete')) {
            if (!vm.user.archived) {
                customActions.push({
                    label: 'Delete',
                    icon: 'archive',
                    order: 15,
                    action() {
                        Alert.confirm({
                            title: locale.getString('sweetalerts.confirm_archive'),
                            text: locale.getString('users.confirm_archive'),
                            type: 'warning',
                            confirmBtn: locale.getString('sweetalerts.yes_archive'),
                            wait: true,
                        }).then(() => {
                            $http.delete('users/' + vm.user.id).then(response => {
                                vm.user = response.data.data;
                                _updateCustomActions();
                                return Alert.success(locale.getString('sweetalerts.archive_successful'), locale.getString('users.archive_successful'));
                            }, response => {
                                return Alert.error(locale.getString('sweetalerts.archive_not_successful'), response.data.message);
                            })
                        })
                    }
                });
            } else {
                customActions.push({
                    label: 'Restore',
                    icon: 'history',
                    order: 10,
                    action() {
                        Alert.confirm({
                            title: locale.getString('common.confirm_restore'),
                            text: locale.getString('users.confirm_restore'),
                            type: 'warning',
                            confirmBtn: locale.getString('common.yes_restore'),
                            wait: true,
                        }).then(() => {
                            $http.put(`users/${ vm.user.id }/restore`)
                                .then(response => {
                                    vm.user = response.data.data;
                                    _updateCustomActions();
                                    Alert.success(locale.getString('common.restore_successful'), locale.getString('users.restore_successful'));
                                }, response => {
                                    Alert.error(locale.getString('common.restore_not_successful'), response.data.message);
                                });
                        });
                    }
                });
                customActions.push({
                    label: 'Delete',
                    icon: 'trash-alt',
                    order: 20,
                    action() {
                        Alert.confirm({
                            title: locale.getString('common.confirm_force_delete'),
                            text: locale.getString('users.confirm_force_delete'),
                            confirmBtn: locale.getString('common.yes_force_delete'),
                            wait: true,
                        }).then(() => {
                            $http.delete(`users/${ vm.user.id }`, {
                                data: {force: true}
                            }).then(() => {
                                Alert.success(locale.getString('common.force_delete_successful'), locale.getString('users.force_delete_successful'));
                                $state.go('app.users.index');
                            }, response => {
                                Alert.error(locale.getString('common.force_delete_not_successful'), response.data.message);
                            });
                        });
                    }
                });
            }
        }
        NavService.overrideMainSideNavActions(customActions);
    }

}
