class duplicatePassbook {
    constructor($state) {

        this.key = 'duplicate-passbook';
        this.title = 'Copy';
        this.level = 'selected';
        this.icon = 'copy';
        this.state = $state;
    }

    action(passbook, vm) {
        passbook.name = passbook.name.concat('- copy');
        return this.state.go('app.passbooks.create', {store: vm.store, model: passbook});
    }

}

angular
    .module('airlst.passbooks')
    .factory('duplicatePassbook', [
        '$state',
        $state => new duplicatePassbook($state)
    ]);
