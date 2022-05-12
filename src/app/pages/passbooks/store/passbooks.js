import Passbooks from '../../../store/passbooks';

angular
    .module('airlst.passbooks')
    .factory('Passbooks', [
        '$injector',
        'Passbook',
        ($injector, Passbook) => new Passbooks(Passbook, {
            injector: $injector
        })
    ]);
