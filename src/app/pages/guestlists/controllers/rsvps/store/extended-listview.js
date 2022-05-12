import RsvpsExtendedListViewCtrl from '../../../../../store/rsvps/controllers/extended-list-view';

angular
    .module('airlst.guestlists')
    .controller('RsvpsExtendedListViewCtrl', [
        'Rsvp',
        '$injector',
        '$scope',
        (Rsvp, $injector, $scope) => new RsvpsExtendedListViewCtrl(Rsvp, $injector, $scope)
    ]);
