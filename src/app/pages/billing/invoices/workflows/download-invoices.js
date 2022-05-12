class DownloadInvoices {
    constructor(Alert, $http, locale) {
        this.key = 'download-invoices';
        this.title = 'Download Invoices';
        this.level = 'selected';
        this.alert = Alert;
        this.locale = locale;
        this.api = $http;
    }

    action({}, store) {
        return this.locale.ready(['categories', 'sweetalerts'])
            .then(() => {
                this.api.post('invoices/download', {
                    invoices: store.getters.selectedFilters
                }).then(() => {
                    store.dispatch('getData');
                    this.alert.success(this.locale.getString('sweetalerts.add_successful'), this.locale.getString('categories.contacts_added'));
                }, err => this.alert.handle(err))
            });
    }

}


angular
    .module('airlst.billing.invoices')
    .factory('downloadInvoices', [
        'Alert',
        '$http',
        'locale',
        (Alert, $http, locale) => new DownloadInvoices(Alert, $http, locale)
    ]);
