class editPassbook {
    constructor($state) {

        this.key = 'edit-passbook';
        this.title = 'Edit';
        this.level = 'highlight';
        this.icon = 'pencil';
        this.state = $state;
    }

    action(passbook, vm) {
        this.state.go('app.passbooks.edit', {id: vm.model.id, passbook: vm.model, manager: vm.manager});
    }


}

angular
    .module('airlst.passbooks')
    .factory('editPassbook', [
        '$state',
        $state => new editPassbook($state)
    ]);
