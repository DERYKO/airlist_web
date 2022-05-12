class createMessage {
    constructor($state) {

        this.key = 'create-message';
        this.title = 'Add New';
        this.level = 'highlight';
        this.icon = 'plus-circle';
        this.state = $state;
    }

    action(payload) {
        this.state.go('app.messages.create');
    }

}

angular
    .module('airlst.messages')
    .factory('createMessage', ['$state', ($state) => new createMessage($state)]);
