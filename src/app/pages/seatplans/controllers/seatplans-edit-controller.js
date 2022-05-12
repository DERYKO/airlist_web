/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.seatplans')
    .controller('SeatplansEditCtrl', [
        '$http',
        'Env',
        'Error',
        '$stateParams',
        '$state',
        'locale',
        'SweetAlert',
        'model',
        'Restangular',
        SeatplansDetailsCtrl
    ]);

function SeatplansDetailsCtrl($http, Env, Error, $stateParams, $state, locale, SweetAlert, model, Restangular) {
    var vm = this;
    vm.model = model;
    vm.groups = vm.model.groups.data;
    delete vm.model.groups;

    vm.save = save;
    vm.cancel = cancel;
    vm.addGroup = addGroup;
    vm.removeGroup = removeGroup;

    function save(model) {
        model.save().then(function (seatplan) {
            vm.model = seatplan;
            var eventToDoAfter = null;

            for (var i = 0; i < vm.groups.length; i++) {
                var curGroup = vm.groups[i];
                if (curGroup.id) {
                    eventToDoAfter = Restangular.all('seatplans/groups').customPUT(curGroup, curGroup.id);
                } else {
                    $http.post(Env.apiUrl + '/seatplans/' + vm.model.id + '/groups', curGroup);
                }
            }

            SweetAlert.swal(locale.getString('seatplans.seatplans.messages.edited'), locale.getString('seatplans.seatplans.messages.edited_message'), 'success');
            cancel();
        }, function (response) {
            Error.checkError(response);
        });
    }

    function cancel() {
        if ($stateParams.store) {
            $stateParams.store.dispatch('getData');
        }
        $state.go('app.seatplans.index');
    }

    function addGroup() {
        vm.groups.push({
            'seatplan_id': vm.model.id,
            'title': locale.getString('seatplans.seatplans.defaults.group_name')
        });
    }

    function removeGroup(group) {
        var indexToDelete = vm.groups.indexOf(group);

        if (indexToDelete > -1) {
            vm.groupsToDelete.push(group);
            vm.groups.splice(indexToDelete, 1);
        }
    }
}