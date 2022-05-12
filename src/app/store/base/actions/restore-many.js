export default (store) => {
    const $http = store.ng.injector.get('$http');
    const locale = store.ng.injector.get('locale');
    const Alert = store.ng.injector.get('Alert');
    return locale.ready('sweetalerts').then(() => {
            return Alert.confirm({
                type: 'warning',
                title: locale.getString('sweetalerts.are_you_sure'),
                message: locale.getString('sweetalerts.restoring_records_confirmation_message'),
                confirmBtn: locale.getString('sweetalerts.yes_restore_selected'),
                wait: true
            }).then(() => {
                return $http.put(store.getters.slug + '/restore', {
                    items: store.getters.selectedFilters
                }).then(() => {
                    Alert.success(locale.getString('sweetalerts.restore_successful'), locale.getString('sweetalerts.records_restored_message'));
                    return store.dispatch('getData')
                }, response => {
                    Alert.handle(response);
                })
            });
        }
    );
}