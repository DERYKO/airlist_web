import mainTemplate from './views/settings.tpl.html';
import customAttributesTemplate from './views/custom-attributes.html';
import notificationSettingsTemplate from './views/notifications-settings.html';
import blackListSettingsTemplate from './views/black-lists-settings.html';
import profileDetailsTemplate from './views/profile-details.tpl.html';
import profileEditorTemplate from './views/profile-editor.tpl.html';

angular
    .module('airlst.settings')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.settings', {
            abstract: true,
            url: '/settings',
            templateUrl: mainTemplate,
            resolve: {
                user: [
                    '$auth',
                    function ($auth) {
                        return $auth.getUser().then(function (user) {
                            return user;
                        });
                    }
                ]
            }
        })
        .state('app.settings.custom', {
            url: '/custom',
            sticky: true,
            data: {
                rights: 'companies::edit',
                view: 'custom'
            },
            views: {
                custom: {
                    templateUrl: customAttributesTemplate,
                    controller: 'CustomsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.settings.notifications', {
            url: '/notifications',
            sticky: true,
            data: {
                rights: 'companies::edit',
                view: 'notifications'
            },
            views: {
                notifications: {
                    templateUrl: notificationSettingsTemplate,
                    controller: 'NotificationsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.settings.blacklists', {
            url: '/blacklists',
            sticky: true,
            data: {
                rights: 'companies::edit',
                view: 'blacklists'
            },
            views: {
                blacklists: {
                    templateUrl: blackListSettingsTemplate,
                    controller: 'BlacklistsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.settings.profile-details', {
            url: '/profile',
            data: {
                view: 'profile'
            },
            views: {
                profile: {
                    controller: 'ProfileDetailsCtrl',
                    controllerAs: 'vm',
                    templateUrl: profileDetailsTemplate
                }
            }
        })
        .state('app.settings.profile-edit', {
            url: '/profile/edit',
            data: {
                view: 'profile'
            },
            views: {
                profile: {
                    controller: 'ProfileEditCtrl',
                    controllerAs: 'vm',
                    templateUrl: profileEditorTemplate
                }
            }
        });
}
