class reviewDuplicates {
    constructor($state) {

        this.key = 'review-duplicates';
        this.title = 'Review';
        this.level = 'row';
        this.state = $state;
    }

    action({row}, store) {
        console.log(row)
        return this.state.go('app.contacts.duplicate', {id: row.id, contact: row, store: store});
    }

}

angular
    .module('airlst.contacts')
    .factory('reviewDuplicates', [
        '$state',
        $state => new reviewDuplicates($state)
    ]);
