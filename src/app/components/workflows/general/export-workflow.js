import templateUrl from '../../views/export-type-modal.tpl.html';

class ExportTypeCtrl {

    constructor(options, store, $uibModalInstance) {
        this.modal = $uibModalInstance;
        this.store = store;
        this.options = options;
    }

    showFilterTag(col) {
        return col.filterable
            && col.type
            && ((typeof (this.store.state.filters[col.key]) === 'object' && this.store.state.filters[col.key] !== null && !this.isEmpty(this.store.state.filters[col.key]))
                || (this.store.state.filters[col.key] && this.store.state.filters[col.key].length)
                || (col.type === 'boolean' && (this.store.state.filters[col.key] === true || this.store.state.filters[col.key] === false))
            );
    }

    isEmpty(obj) {
        let empty = true;
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] && obj[key].length)
                empty = false;
        }
        return empty;
    }

    displayFilter(val) {
        if (!val) {
            return val;
        }
        if (_.isArray(val)) {
            return val.join(', ');
        }

        if (val.min || val.max) {
            let date = '';
            if (val.min) {
                date = date.concat(' From: ', val.min);
            }

            if (val.max) {
                date = date.concat(' To: ', val.max);
            }
            return date;
        }

        if (_.isBoolean(val)) {
            return val ? 'Yes' : 'No';
        }
        return val;
    }

    select(type) {
        this.modal.close(type);
    }

    close() {
        this.modal.dismiss();
    }
}

class ExportWorkflow {
    constructor(slug, Alert, $http, $uibModal, options) {
        this.slug = slug;
        this.alert = Alert;
        this.api = $http
        this.modal = $uibModal;
        this.key = `export-${slug}`;
        this.title = `Export ${_.capitalize(slug)}`;
        this.level = 'selected';
        this.order = 40;

        this.options = options || {
            pdf: 'PDF',
            excel: 'Excel',
            csv: 'CSV',
        }
    }

    action({}, store) {
        return this.modal.open({
            templateUrl: templateUrl,
            controller: ['options', 'store', '$uibModalInstance', ExportTypeCtrl],
            controllerAs: 'vm',
            resolve: {
                store: () => {
                    return store;
                },
                options: () => {
                    return this.options
                }
            }
        }).result.then(type => {
            const data = {
                type
            };

            data[store.state.slug] = store.getters.selectedFilters;
            data[store.state.slug].fields = store.state.visible;

            return this.api.post(store.getters.exportSlug + '/export', data)
                .then(
                    () => this.alert.success('Export Scheduled', 'An export has been scheduled. You should receive an email with the link in a few minutes'),
                    response => this.alert.handle(response)
                );
        }, response => this.alert.handle(response));
    }
};

export default ExportWorkflow;
