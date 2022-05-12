/**
 * @ngdoc service
 * @name checkins.factory:sampleWithSelectedAction
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('sampleWithSelectedAction', [
        'SweetAlert',
        sampleWithSelectedAction
    ]);

function sampleWithSelectedAction(SweetAlert) {
    return {
        key: 'sample-with-selected-action',
        title: 'Sample Selected',
        level: 'selected',
        action: function () {
            console.log(arguments);
            SweetAlert.success('Clicked with selected');
        }
    }
};