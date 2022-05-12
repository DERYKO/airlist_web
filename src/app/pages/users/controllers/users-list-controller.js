import '../store/users'

class UsersListCtrl {
    constructor(Users) {
        this.store = Users;
        this.store.dispatch('loadWorkflows', 'users::list');
        this.store.commit('setVm', this);
    }
}

angular
    .module('airlst.users')
    .controller('UsersListCtrl', [
        'Users',
        UsersListCtrl
    ]);

