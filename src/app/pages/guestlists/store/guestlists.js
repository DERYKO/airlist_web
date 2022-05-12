import Guestlists from '../../../store/guestlists';

angular
    .module('airlst.guestlists')
    .factory('Guestlists', [
        '$injector',
        'Guestlist',
        ($injector, Guestlist) => new Guestlists(Guestlist, {
            injector: $injector
        })
    ]);
