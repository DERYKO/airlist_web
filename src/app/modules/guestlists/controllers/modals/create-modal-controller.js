import moment from 'moment';

export default class GuestlistCreateModalController {

    constructor($scope, $injector, $uibModalInstance) {
        this.scope = $scope;
        this.injector = $injector;
        this.modalInstance = $uibModalInstance;
        this.translate = this.injector.get('$translate');
        this.api = this.injector.get('$http');
        this.log = this.injector.get('$log');
        this.submitting = false;

        this.isPrivateGuestlist = false;
        this.model = {
            name: '',
            settings: {
                start_date: new Date(),
                end_date: new Date(),
            },
            permission: 'public'
        };

        this._resetError();
    }

    dismiss() {
        this.modalInstance.dismiss();
    }

    submit(form) {
        this._resetError();
        if (!form.$valid) {
            this._setError(this.translate.instant('guestlists.modals.create.messages.invalid_data'));
            return;
        }

        this.submitting = true;

        this.api.post('guestlists/create-with-dependencies', this._prepareModelForApi()).then((response) => {
            this.modalInstance.close({
                guestlist: response.data.data
            });
        }, (e) => {
            this._setError(this.translate.instant('guestlists.modals.create.messages.api_error'));
            this.log.error('Error while creating guestlist', e);
            this.submitting = false;
        });
    }

    _resetError() {
        this.error = {
            active: false,
            message: ''
        };
    }

    _setError(message) {
        this.error = {
            active: true,
            message: message
        };
    }

    _prepareModelForApi() {
        const dataForApi = _.cloneDeep(this.model);

        dataForApi.permission = this.isPrivateGuestlist ? 'private' : 'public';
        dataForApi.settings.start_date = moment(dataForApi.settings.start_date, 'Y-M-D HH:mm').format();
        dataForApi.settings.end_date = moment(dataForApi.settings.end_date, 'Y-M-D HH:mm').format();

        return dataForApi;
    }
}

GuestlistCreateModalController.$inject = [
    '$scope',
    '$injector',
    '$uibModalInstance'
];
