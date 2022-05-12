/**
 * @ngdoc service
 * @name settings.factory:editProfile
 *
 * @description
 *
 */
angular
    .module('airlst.settings')
    .factory('editProfile', [
        '$state',
        ($state) => new EditProfileWorkflow($state)
    ]);

class EditProfileWorkflow {
    constructor($state) {
        this.state = $state;

        this.key = 'edit-profile';
        this.title = 'Edit Profile';
        this.level = 'highlight';
        this.icon = 'pencil';
    }

    action() {
        this.state.go('app.settings.profile-edit');
    }
}
