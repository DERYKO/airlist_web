import askQuestionModal from '../views/contact-genderize-modal.html';

/**
 * @ngdoc service
 * @name checkins.factory:genderizeContacts
 * @description
 *
 */
class askQuestionCtrl {
    constructor($uibModalInstance) {
        this.modal = $uibModalInstance;
    }

    all() {
        this.modal.close(false);
    }

    unknown() {
        this.modal.close(true);
    }

    close() {
        this.modal.dismiss('cancel');
    }

}

class genderizeContacts {
    constructor(Alert, $http, $uibModal) {
        this.key = 'genderize-contacts';
        this.title = 'Genderize contacts';
        this.level = 'selected';
        this.api = $http;
        this.alert = Alert;
        this.modal = $uibModal;
    }

    action({}, store) {
        return this.modal.open({
            size: 'md',
            templateUrl: askQuestionModal,
            controller: ['$uibModalInstance', askQuestionCtrl],
            controllerAs: 'vm'
        })
            .result.then(unknown => {
                this.api.post('contacts/genderize', {
                    fields: {unknown},
                    contacts: store.getters.selectedFilters,
                }).then(() => {
                    this.alert.success('Contacts gender', 'Checking of the contacts gender has been scheduled');
                    return store.dispatch('getData');
                }, response => {
                    this.alert.error('Check failed', response.data.message);
                });
            }, response => {
                this.alert.handle(response)
            });
    }
}


export default genderizeContacts;