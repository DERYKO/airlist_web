import Users from '../../../store/users';

angular
    .module('airlst.users')
    .factory('Users', [
        '$injector',
        'User',
        ($injector, User) => new Users(User, {
            injector: $injector
        })
    ]);
