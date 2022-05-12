import genderizeContacts from '../../libraries/genderize-contacts';

angular
    .module('airlst.contacts')
    .factory('genderizeContacts', [
        'Alert',
        '$http',
        '$uibModal',
        (Alert, $http, $uibModal) => new genderizeContacts(Alert, $http, $uibModal)
    ]);

