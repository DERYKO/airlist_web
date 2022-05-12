import templateUrl from '../templates/save-preset.tpl.html';

export default (store) => {
    const $uibModal = store.ng.injector.get('$uibModal');

    $uibModal.open({
        templateUrl,
        controllerAs: 'vm',
        controller: ['Alert','$http', 'store', '$uibModalInstance', function (Alert, $http, store, $uibModalInstance) {
            this.model = {
                name: '',
                table: store.state.listview,
                presets: {
                    archived: store.state.archived,
                    sort: store.state.sort,
                    keyword: store.state.keyword,
                    view: store.state.view,
                    filters: store.state.filters,
                    showFilters: store.state.showFilters,
                    visible: store.state.visible,
                    pagination: {perPage: store.state.pagination.perPage}
                }
            };

            this.save = () => {
                $http.post('presets', this.model)
                    .then(() => {
                        Alert.success('Preset saved!');
                        $uibModalInstance.close()
                    }, err => Alert.handle(err))
            };

            this.close = $uibModalInstance.dismiss;
        }],
        resolve: {
            store
        }
    }).result.then(null, () => ({}))

}

