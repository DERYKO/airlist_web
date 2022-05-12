/**
 * @ngdoc object
 * @name theme.base.controller:LocaleCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.theme.base')
    .controller('LocaleCtrl', [
        '$scope',
        'locale',
        'localeSupported',
        'localeEvents',
        LocaleCtrl
    ]);

function LocaleCtrl($scope, locale, localeSupported, localeEvents) {
    var vm = this;
    vm.available = localeSupported;
    vm.selected = {};
    vm.meta = {
        'en-US': {
            flag: 'us',
            name: 'English'
        }
    };

    vm.setLocale = function (loc) {
        locale.setLocale(loc);
    };

    vm.updateSelected = function (key) {
        vm.selected.key = key;
        vm.selected.flag = vm.meta[key].flag;
        vm.selected.name = vm.meta[key].name;
    };

    locale.ready('common').then(function () {
        vm.updateSelected(locale.getLocale());
    });

    $scope.$on(localeEvents.localeChanges, function (event, key) {
        vm.updateSelected(key);
    });
}