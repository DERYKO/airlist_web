/**
 * @ngdoc service
 * @name checkins.factory:Checkin
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('Checkin', [
        'locale',
        'Resource',
        Checkin
    ]);

function Checkin(locale, Resource) {
    var $model = Resource.make('checkins');

    $model.title = ' Checkin(s)';

    $model.getSchema = function () {
        return locale.ready(['checkins', 'profile']).then(function () {
            return {
                type: 'object',
                title: locale.getString('common.checkin'),
                properties: {
                    id: {
                        title: locale.getString('common.id'),
                        type: 'number',
                        mergeable: false,
                        columnDef: {
                            main: true
                        }
                    },
                    location: {
                        title: locale.getString('common.location'),
                        type: 'number'
                    },
                    pax_new: {
                        title: locale.getString('checkins.pax_new'),
                        type: 'number'
                    },
                    pax_old: {
                        title: locale.getString('checkins.pax_old'),
                        type: 'number'
                    },
                    type: {
                        title: locale.getString('common.type'),
                        type: 'number'
                    },
                    rsvp_id: {
                        type: 'number',
                        title: locale.getString('common.rsvp'),
                        listview: 'hidden',
                        columnDef: {
                            template: function (rsvp, row) {
                                if (rsvp == 0)
                                    return locale.getString('common.no_rsvp');
                                return '<a class="btn btn-info" href="#/guestlists/' + row.rsvp.data.guestlist_id + '/rsvps/' + rsvp + '">' + locale.getString('common.rsvp') + '</a>'
                            }
                        }
                    },
                    contact_id: {
                        type: 'number',
                        title: locale.getString('common.contact'),
                        listview: 'hidden',
                        columnDef: {
                            template: function (id, row) {
                                if (!id || id == 0)
                                    return locale.getString('common.no_contact_info');
                                return '<span >' + row.contact.data.full_name + '</span>'
                            }
                        }
                    },
                    user_id: {
                        type: 'number',
                        title: locale.getString('common.created_by'),
                        listview: 'hidden',
                        columnDef: {
                            template: function (id, row) {
                                if (id == 0)
                                    return locale.getString('common.no_contact_info');
                                return '<span >' + row.user.data.full_name + '</span>'
                            }
                        }
                    },
                    created_at: {
                        title: locale.getString('profile.created_at'),
                        type: 'string',
                        listview: 'hidden',
                        format: 'datetime'
                    },
                    updated_at: {
                        title: locale.getString('profile.updated_at'),
                        type: 'string',
                        listview: 'hidden',
                        format: 'datetime'
                    }
                },
                required: []
            };
        });
    };

    return $model;
}
