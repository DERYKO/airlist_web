import moment from 'moment';

export default class AbstractAlGuestlistEditorPagesController {

    constructor($injector, $scope) {
        this.injector = $injector;
        this.scope = $scope;
        this.acl = this.injector.get('Acl');
        this.log = this.injector.get('$log');
        this.translate = this.injector.get('$translate');
        this.depositService = this.injector.get('Deposit');
        this.angularState = this.injector.get('$state');
        this.model = {};
        this.guestlist = null;

        this._resetState();
        this._initWatchers();
    }

    $onInit() {
        this._initFormConfig();
    }

    // internal used functions
    _initWatchers() {
        this.scope.$watch(() => {
            return this.model;
        }, () => {
            this._triggerModelUpdate();
        }, true);

        this.scope.$watch(() => {
            return this.guestlist;
        }, (newVal, oldVal) => {
            if (this.guestlist && !_.isEqual(newVal, oldVal)) {
                this._fillModelFromGuestlist();
            }
        }, true);
    }

    _fillModelFromGuestlist() {
        this.log.warn(`_fillModelFromGuestlist not implemented in class: ${_.get(this, 'constructor.name', 'class name can not be determined')}`);
    }

    _initFormConfig() {
        this.log.info(`_initFormConfig not implemented in class: ${_.get(this, 'constructor.name', 'class name can not be determined')}`);
    }

    _updateState(newState) {
        this.state = newState;
        this.scope.$applyAsync();
    }

    _resetState() {
        this._updateState({
            formConfig: {}
        });
    }

    getGuestlistValue(path) {
        return _.cloneDeep(_.get(this.guestlist, path));
    }

    transformDateForDateField(date) {
        return moment(date).format('Y-M-D HH:mm');
    }

    transformDateFieldForModel(value) {
        return moment(value, 'Y-M-D HH:mm').format();
    }

    _triggerModelUpdate(){
        if (this.onModelUpdate) {
            this.onModelUpdate({
                newValues: _.cloneDeep(this.model)
            });
        }
    }
}

AbstractAlGuestlistEditorPagesController.$inject = [
    '$injector',
    '$scope'
];
