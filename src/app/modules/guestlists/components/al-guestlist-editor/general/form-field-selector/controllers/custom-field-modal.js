export default class AlGuestlistFormFieldCustomFieldModalController {

    constructor($uibModalInstance, $scope, $injector, currentDefinition, alreadyExists, fieldAvailabilities) {
        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.injector = $injector;
        this.translate = this.injector.get('$translate');
        this.filter = this.injector.get('$filter');
        this.definition = currentDefinition;
        this.alreadyExists = !!alreadyExists;
        this.fieldAvailabilities = fieldAvailabilities;

        this.disableGlobalCheckbox = false;
        this.isGlobalField = false;

        this._initGlobalFieldInformation();
    }

    _initGlobalFieldInformation() {
        if (this.fieldAvailabilities.contact) {
            if (!this.fieldAvailabilities.rsvp) {
                this.disableGlobalCheckbox = true;
                this.isGlobalField = true;
            } else {
                this.disableGlobalCheckbox = false;
                this.isGlobalField = false;
            }
        } else {
            this.disableGlobalCheckbox = true;
            this.isGlobalField = false;
        }
    }

    dismiss() {
        this.modalInstance.dismiss();
    }

    save(form, action, data) {
        if(form && !form.$valid) {
            return;
        }

        data = data || {};

        if (!this.alreadyExists) {
            data.group = this.isGlobalField ? 'contact' : 'rsvp';
        }

        this.modalInstance.close({
            action,
            data: data || null
        });
    }
}

AlGuestlistFormFieldCustomFieldModalController.$inject = [
    '$uibModalInstance',
    '$scope',
    '$injector',
    'currentDefinition',
    'alreadyExists',
    'fieldAvailabilities'
];
