/**
 * @ngdoc service
 * @name checkins.factory:testSelective
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('testSelective', testSelective);

function testSelective() {
    return {
        key: 'test-selective',
        title: 'Selective',
        level: 'global',
        class: 'btn btn-default',
        action: save
    };

    function save(contact, vm) {
        contact.selectiveSave({invalid: true});
    }
}