export default (store) => {
    const $http = store.ng.injector.get('$http');
    const locale = store.ng.injector.get('locale');
    const Alert = store.ng.injector.get('Alert');

    return locale.ready([...store.state.requiredTranslations, 'sweetalerts']).then(() => {
            let alertConfig = {
                    type: 'warning',
                    title: locale.getString('sweetalerts.archive_many_headline'),
                    message: locale.getString('sweetalerts.archiving_records_confirmation_message'),
                    confirmBtn: locale.getString('sweetalerts.yes_archive_selected'),
                    wait: true
                },
                alertConfigOverride = _.get(store.state, 'alertOverrides.bulkArchive', {});

            if (alertConfigOverride.title) {
                alertConfig.title = locale.getString(alertConfigOverride.title);
            }

            if (alertConfigOverride.message) {
                alertConfig.message = locale.getString(alertConfigOverride.message);
            }

            return Alert.confirm(alertConfig).then(() => {
                return $http.delete(store.getters.slug, {data: {items: store.getters.selectedFilters}})
                    .then(() => {
                        Alert.success(locale.getString('sweetalerts.archive_successful'), locale.getString('sweetalerts.records_archived_message'));
                        store.dispatch('getData');
                    }, response => {
                        Alert.handle(response);
                    })

            }, () => {

            });
        }
    );
}
