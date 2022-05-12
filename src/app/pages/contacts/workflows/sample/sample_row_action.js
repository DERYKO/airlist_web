/**
 * @ngdoc service
 * @name checkins.factory:sampleRowAction
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('sampleRowAction', [
        'SweetAlert',
        sampleRowAction
    ]);

function sampleRowAction(SweetAlert) {
    return {
        key: 'sample-row-action',
        title: 'Sample Row',
        level: 'row',
        class: 'btn btn-danger',
        action: function () {
            console.log(arguments);
            SweetAlert.success('Clicked sample row action');
        }
    }
}