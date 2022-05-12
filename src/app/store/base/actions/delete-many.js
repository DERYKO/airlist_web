export default (store) => {
    const $http = store.ng.injector.get('$http');
    const locale = store.ng.injector.get('locale');
    const Alert = store.ng.injector.get('Alert');

    return locale.ready([...store.state.requiredTranslations, 'sweetalerts']).then(() => {
            let alertConfig = {
                    type: 'warning',
                    title: locale.getString('sweetalerts.delete_many_headline'),
                    message: locale.getString('sweetalerts.deleting_records_confirmation_message'),
                    confirmBtn: locale.getString('sweetalerts.yes_delete_selected'),
                    wait: true
                },
                alertConfigOverride = _.get(store.state, 'alertOverrides.bulkDelete', {});

            if (alertConfigOverride.title) {
                alertConfig.title = locale.getString(alertConfigOverride.title);
            }

            if (alertConfigOverride.message) {
                alertConfig.message = locale.getString(alertConfigOverride.message);
            }

            return Alert.confirm(alertConfig).then(() => {
                return $http.delete(store.getters.slug, {
                    data: {
                        items: store.getters.selectedFilters,
                        force: true
                    }
                }).then(() => {
                    Alert.success(locale.getString('sweetalerts.delete_successful'), locale.getString('sweetalerts.records_archived_message'));
                    return store.dispatch('getData');
                }, response => {
                    Alert.handle(response);
                })
            }, () => {

            });
        }
    );
};
