import RsvpsDuplicates from '../../../store/rsvps/duplicates';

angular
    .module('airlst.guestlists')
    .factory('RsvpDuplicates', [
        '$injector',
        'Rsvp',
        ($injector, Rsvp) => {
            return {
                create(name) {
                    return new RsvpsDuplicates(name, Rsvp, {
                        injector: $injector
                    });
                }
            }
        }
    ]);
