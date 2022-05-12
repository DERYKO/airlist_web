import modalTemplate from '../../views/workflows/quick-create-contact.tpl.html';

class QuickCreateContactWorkflow {
    constructor($state, $uibModal) {
        this.key = 'quick-create-contact';
        this.title = 'Quick Create Contact';
        this.level = 'highlight';
        this.icon = 'plus-hexagon';
        this.state = $state;
        this.order = 20;
        this.uibModal = $uibModal;
    }

    action(payload, store) {
        this.uibModal.open({
            templateUrl: modalTemplate,
            controller: 'QuickCreateContactController',
            controllerAs: 'vm',
            size: 'md'
        }).result.then(() => {
            store.dispatch('getData');
        }, () => {
            store.dispatch('getData');
        }).catch(() => {
            store.dispatch('getData');
        });
    }

}

class QuickCreateContactController {
    constructor(Contact, $uibModalInstance, Alert) {
        this.contactModel = Contact;
        this.modalInstance = $uibModalInstance;
        this.alert = Alert;

        this.schema = [];
        this.customFields = {};
        this.contactModel.getSchema().then((schema) => {
            this.schema = schema;
            this.prepareCustomFields();
        });

        this.model = {
            sex: 'unknown',
            addressbook: true
        }
    }

    prepareCustomFields() {
        this.customFields = {};
        _.each(this.schema.properties, (field, key) => {
            if (key.match(/^custom_/)) {
                if (!_.isUndefined(field.type) && field.type !== '') {
                    this.customFields[key] = field;
                }
            }
        })
    }

    prepareModelForApi(model) {
        const out = _.cloneDeep(model);

        for (let i = 1; i <= 40; i++) {
            const currentField = _.get(this.customFields, 'custom_' + i, null);
            if (currentField) {
                if ((currentField.type === 'date' || currentField.type === 'datetime') && !_.get(out, 'custom_' + i)) {
                    out['custom_' + i] = null;
                }
            }
        }

        return out;
    }

    dismissModal() {
        this.modalInstance.dismiss();
    }

    closeModal() {
        this.modalInstance.close();
    }

    save(form) {
        this.contactModel.post(this.prepareModelForApi(this.model)).then(() => {
            this.alert.success('Success', 'Contact was created successful');
            this.closeModal();
        }, (e) => {
            this.alert.handle(e);
        });
    }
}

QuickCreateContactController.$inject = [
    'Contact',
    '$uibModalInstance',
    'Alert'
];

angular
    .module('airlst.contacts')
    .factory('quickCreateContact', [
        '$state',
        '$uibModal',
        ($state, $uibModal) => new QuickCreateContactWorkflow($state, $uibModal)
    ])
    .controller('QuickCreateContactController', QuickCreateContactController);
