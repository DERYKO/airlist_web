/**
 * @ngdoc object
 * @name contacts.controller:ContactsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .controller('ContactsMultipleEditorCtrl', [
        'Contact',
        '$http',
        'locale',
        'ResourceCommon',
        'Restangular',
        '$state',
        '$stateParams',
        'Alert',
        '$window',
        '$rootScope',
        ContactsMultipleEditorCtrl
    ]);

function ContactsMultipleEditorCtrl(Contact, $http, locale, ResourceCommon, Restangular, $state, $stateParams, Alert, $window, $rootScope) {
    var vm = this;
    vm.save = save;
    vm.cancelEditing = close;
    vm.store = $stateParams.store;

    init();

    function init() {
        vm.store = $stateParams.store;
        vm.editView = _.get($rootScope.user, 'settings.core.use_light_version') ? 'light' : 'full';
        
        return Contact.getSchema().then(function (schema) {
            vm.schema = schema;
            if (!vm.store) {
                Alert.error('You must first select rows before updating them');
                $state.go('app.contacts.index');
            }
            vm.model = {};
        });
    }


    function save(fields) {
        return locale.ready('sweetalerts').then(() => {
            return $http.put('contacts', {
                    relationship: $stateParams.relationship,
                    fields,
                    items: vm.store.getters.selectedFilters
                })
                .then(() => {
                    Alert.success(locale.getString('sweetalerts.records_saved'), locale.getString('sweetalerts.records_saved_message'));
                    vm.store.dispatch('getData');
                    return close()
                }, response => {
                    Alert.error(locale.getString('sweetalerts.saving_unsuccessful'), response.data.message);
                    return close();
                });
        });
    }

    function close() {
        var previous, count = 0, route = {
            path: _.has($state.current.name, 'picklists') ? 'app.picklists.contacts.index' : 'app.contacts.index',
            params: $stateParams,
            data: {}
        };

        // avoid going to different listview is we already know contact is viewed via a picklist
        if (!_.has($state.current.name, 'picklists')) {
            // find the last listview to be visited before the contact was shown
            do {
                previous = $state.previous(count);
                if (previous && _.endsWith(previous.state.name, '.index')) {
                    route = {
                        path: previous.state.name,
                        params: _.defaults(previous.params, route.params),
                        data: {}
                    };
                    break;
                }
                count++;
            } while (previous && !_.endsWith(previous.state.name, '.index'));
        }

        $state.go(route.path, route.params, route.data);
    }
}
