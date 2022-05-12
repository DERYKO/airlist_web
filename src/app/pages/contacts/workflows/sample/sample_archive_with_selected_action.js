/**
 * @ngdoc service
 * @name checkins.factory:sampleArchiveWithSelectedAction
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('sampleArchiveWithSelectedAction', [
        'SweetAlert',
        sampleArchiveWithSelectedAction
    ]);

function sampleArchiveWithSelectedAction(SweetAlert) {
    return {
        key: 'sample-archive-with-selected-action',
        title: 'Sample Deleted Selected',
        level: 'archivedSelected',
        action: function () {
            console.log(arguments);
            SweetAlert.success('Clicked deleted with selected');
        }
    }
};
