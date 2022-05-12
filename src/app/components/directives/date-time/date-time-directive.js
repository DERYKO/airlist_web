import template from './date-time-directive.tpl.html';


/**
 * @ngdoc directive
 */
angular
    .module('airlst.components')
    .directive('dateTime', [
        dateTime
    ]);

function dateTime() {
    return {
        restrict: 'E',
        scope: {},
        bindToController: {
            model: '=ngModel',
            dateOptions: '=',
            timeOptions: '='
        },
        templateUrl: template,
        replace: false,
        controllerAs: 'dateTime',
        controller: dateTimeCtrl
    };
}

function dateTimeCtrl(moment) {
    var vm = this;
    vm.formChanged = false;
    vm.dateOpen = false;

    vm.updateTime = updateTime;
    vm.updateDate = updateDate;

    init();

    function init() {
        if (!(vm.date instanceof Date) || _.isUndefined(vm.date)) {
            vm.date = moment(vm.model, 'DD.MM.YYYY HH:mm').local().toDate();
            updateModel();
        }

        if (_.isUndefined(vm.dateOptions)) {
            vm.dateOptions = {
                defaultDate: new Date()
            };
        }
        if (_.isUndefined(vm.timeOptions)) {
            vm.timeOptions = {
                hourStep: "1",
                minuteStep: "1",
                showMeridian: true
            };
        }
        vm.time = vm.date;
    }

    // update vm.date with new time
    function updateTime() {
        if (vm.date && vm.time) {
            // convert from ISO format to Date
            if (!(vm.date instanceof Date))
                vm.date = new Date(vm.date);

            vm.date.setHours(vm.time.getHours(), vm.time.getMinutes(), 0, 0);
        }
        updateModel();
    }

    // update vm.date with current time
    function updateDate() {
        if (vm.date) {
            vm.date.setHours(vm.time.getHours(), vm.time.getMinutes(), 0, 0);
        }
        updateModel();
    }

    function updateModel() {
        vm.model = moment.utc(moment(vm.date).format('DD.MM.YYYY HH:mm'), 'DD.MM.YYYY HH:mm').format();
    }

}
