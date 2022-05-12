import SeatplanElements from '../../../store/seatplans/elements/index';

angular
    .module('airlst.seatplans')
    .factory('SeatplanElements', [
        '$injector',
        'SeatplanElement',
        ($injector, SeatplanElement) => new SeatplanElements(SeatplanElement, {
            injector: $injector
        })
    ]);
