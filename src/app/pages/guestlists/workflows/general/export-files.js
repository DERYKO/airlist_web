/**
 * @ngdoc service
 * @name checkins.factory:exportPdf
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('exportFiles', [
        'Alert',
        '$http',
        exportPdf
    ]);
//@todo refactor after api updated
function exportPdf(Alert, $http) {
    return {
        key: 'export-files',
        title: 'Export Bookings(Files)',
        level: 'selected',
        action({}, store) {
            const data = {
                filters: store.getters.selectedFilters,
                type: 'files',
                columns: store.state.columns
            };

            return $http.post(`${ store.getters.slug }/export`, data)
                .then(
                    () => Alert.success('Export Scheduled', 'An export has been scheduled. You should receive an email with the link in a few minutes'),
                    response => Alert.handle(response)
                );
        }
    };

}