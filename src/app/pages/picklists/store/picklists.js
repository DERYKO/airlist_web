import Picklists from '../../../store/picklists';

angular
    .module('airlst.picklists')
    .factory('Picklists', [
        '$injector',
        'Picklist',
        ($injector, Picklist) => new Picklists(Picklist, {
            injector: $injector
        })
    ]);
