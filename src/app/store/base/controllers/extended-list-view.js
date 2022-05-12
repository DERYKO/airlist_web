export default class BaseExtendedListViewController {
    get row() {
        return this._row;
    }

    set row(value) {
        this._row = value;
    }

    constructor(repo, injector, $scope) {
        this.injector = injector;
        this.repo = repo;
        this.scope = $scope;
        this.acl = injector.get('Acl');
        this.alert = injector.get('Alert');
        this.api = injector.get('$http');
        this.rootScope = injector.get('$rootScope');
        this.state = injector.get('$state');
        this.timeout = injector.get('$timeout');
        this.model = null;
        this.loading = true;
        this.store = null;
        this.parameters = {};
        this.currentView = 'overview';
        this.availableViews = [
            {
                key: 'overview',
                label: 'overview'
            }
        ];
    }

    setRow(row) {
        this._row = row;
        this.loading = true;
        this.init();
    }

    setStore(store) {
        this.store = store;
    }

    init() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this._checkIfGridToCalculateAndSetHeight();
        return this.repo.one(this._row.id).get(this.parameters).then((model) => {
            this.model = model.plain();
            this.loading = false;

            this._checkIfGridToCalculateAndSetHeight();
        });
    }

    goToView(newView) {
        this.currentView = newView;
    }

    _checkIfGridToCalculateAndSetHeight() {
        this.timeout(() => {
            let extendedRows = angular.element('li.og-expanded');

            extendedRows.each((key, row) => {
                let $row = jQuery(row),
                    expander = $row.find('.og-expander'),
                    gridBox = $row.find('.grid-box');

                if(expander.length > 0 && gridBox.length > 0) {
                    $row.height(expander.outerHeight(true) + gridBox.outerHeight(true));
                }
            });
        }, 10);
    }
}
