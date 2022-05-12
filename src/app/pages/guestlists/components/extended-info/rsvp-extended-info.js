import templateUrl from './rsvp-extended-info.tpl.html';

function RsvpExtendedCtrl(Rsvp, $scope) {
    const vm = this;

    init();

    function init() {
        $scope.$watch('vm.rsvp', function(){
            if(vm.rsvp) {
                Rsvp.setGuestlist(vm.rsvp.guestlist.data).getSchema().then(function(schema){
                    vm.schema = schema;
                });
            }
        })
    }
}

angular
    .module('airlst.guestlists')
    .component('rsvpExtendedInfo', {
        bindings: {
            rsvp: '='
        },
        controller: ['Rsvp', '$scope', RsvpExtendedCtrl],
        controllerAs: 'vm',
        templateUrl: templateUrl
    });