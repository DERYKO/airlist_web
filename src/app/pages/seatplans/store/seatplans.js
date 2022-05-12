import Seatplans from '../../../store/seatplans/main/index';

angular
    .module('airlst.seatplans')
    .factory('Seatplans', [
        '$injector',
        'Seatplan',
        ($injector, Seatplan) => new Seatplans(Seatplan, {
            injector: $injector
        })
    ]);
