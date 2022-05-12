import Tickets from '../../../store/tickets';

angular
    .module('airlst.tickets')
    .factory('Tickets', [
        '$injector',
        'Ticket',
        ($injector, Ticket) => new Tickets(Ticket, {
            injector: $injector
        })
    ]);
