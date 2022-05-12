/**
 * @ngdoc service
 * @name users.factory:User
 *
 * @description
 *
 */
angular
    .module('airlst.users')
    .factory('User', [
        'locale',
        'Resource',
        '$auth',
        User
    ]);

function User(locale, Resource, $auth) {
    var $model = Resource.make('users');

    $model.title = ' Users';

    $model.schema = locale.ready(['users', 'profile']).then(function () {
        return {
            type: 'object',
            title: locale.getString('users.title_details'),
            properties: {
                profile_image: {
                    title: 'Profile Image',
                    default: 'http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y&s=125',
                    listview: 'hidden',
                    columnDef: {
                        width: 45,
                        enableFiltering: false,
                        displayName: 'Profile Image',
                        cellTemplate: "<img class=\"grid-image\" ng-src=\"{{grid.getCellValue(row, col)}}\" lazy-src>"
                    },
                    type: 'string',
                    format: 'image',
                    'x-schema-form': {
                        text: false,
                        uploader: true,
                        type: 'imageuploader',
                        class: 'profile-userpic-large',
                        preview: true
                    }
                },
                first_name: {
                    title: locale.getString('profile.first_name'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                last_name: {
                    title: locale.getString('profile.last_name'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                email: {
                    title: locale.getString('profile.email'),
                    type: 'string'
                },
                password: {
                    title: locale.getString('profile.reset_password'),
                    type: 'string',
                    listview: false,
                    'x-schema-form': {
                        type: 'password'
                    }
                },
                activated: {
                    title: locale.getString('profile.activated'),
                    type: 'boolean',
                    listview: 'hidden',
                    default: false,
                    enum: [1, 0],
                    'x-schema-form': {
                        titleMap: [
                            {value: true, name: 'Yes'},
                            {value: false, name: 'No'}
                        ]
                    }
                },
                permissions: {
                    type: 'object',
                    listview: false,
                    properties: {
                        admin: {
                            title: locale.getString('profile.admin'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        addressbook: {
                            title: locale.getString('profile.address_book'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        guestlist_read: {
                            title: locale.getString('profile.guestlist_read'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        guestlist_write: {
                            title: locale.getString('profile.guestlist_write'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        guestlist_delete: {
                            title: locale.getString('profile.guestlist_delete'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        contact_export: {
                            title: locale.getString('profile.contact_export'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        category: {
                            title: locale.getString('profile.category'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        restricted_contacts: {
                            title: locale.getString('profile.restricted_contacts'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        },
                        payment: {
                            title: locale.getString('profile.payment'),
                            type: 'boolean',
                            listview: 'hidden',
                            enum: [1, 0]
                        }
                    }
                }
            }
        };
    });


    return $model;
}