import RsvpsDuplicatesExtendedListViewCtrl from '../../../../../store/rsvps/controllers/duplicates-extended-list-view';

angular
    .module('airlst.guestlists')
    .controller('RsvpsDuplicatesExtendedListViewCtrl', [
        '$injector',
        '$scope',
        ($injector, $scope) => new RsvpsDuplicatesExtendedListViewCtrl($injector, $scope)
    ]);
