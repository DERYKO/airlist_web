import Rsvps from '../../../store/rsvps';

angular
    .module('airlst.guestlists')
    .factory('Rsvps', [
        '$injector',
        'Rsvp',
        ($injector, Rsvp) => {
            return {
                create(name) {
                    return new Rsvps(name, Rsvp, {
                        injector: $injector
                    })
                }
            }
        }
    ]);
