import beefreeTemplate from './beefree-directive.tpl.html';
import sendTestEmailTemplate from './send-test-email.tpl.html';


/**
 * @ngdoc directive
 * @name templates.directive:beefree
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="templates">
 <file name="index.html">
 <beefree></beefree>
 </file>
 </example>
 *
 */
angular
    .module('airlst.templates.main')
    .directive('beefree', [
        'Error',
        '$q',
        '$state',
        'locale',
        'Restangular',
        'SelectBox',
        'Contact',
        'Guestlist',
        'Rsvp',
        'SweetAlert',
        '$rootScope',
        '$uibModal',
        beefree
    ]);

function beefree(Error, $q, $state, locale, Restangular, SelectBox, Contact, Guestlist, Rsvp, SweetAlert, $rootScope, $uibModal) {
    return {
        restrict: 'EA',
        scope: {
            model: '=',
            onSave: '&'
        },
        templateUrl: beefreeTemplate,
        replace: false,
        controllerAs: 'beefree',
        controller: function () {
            var vm = this;
            vm.name = 'beefree';
        },
        link: function (scope, element, attrs) {
            scope.model.loadingBeeFree = true;
            $q.when(scope.model).then(function () {

                Restangular.one('services/credentials/beefree').get().then(function (response) {
                    initialise(scope, scope.model.beefree_json, response);
                });

            });
        }
    };

    function initialise(scope, jsonTemplate, response) {

        if (_.isEqual({}, jsonTemplate) || _.isUndefined(jsonTemplate)) {
            jsonTemplate = response.default_template;
        }

        var config = {
            uid: response.uid,
            container: 'bee-plugin-container',
            language: locale.getLocale(),
            preventClose: true,
            autosave: 15,
            mergeTags: response.mergeTags,
            onAutoSave() {
                $rootScope.editing = true;
            },
            onSave(jsonFile, htmlFile) {
                scope.model.beefree_json = jsonFile;
                scope.model.html = htmlFile;
                scope.model.fromTemplate = false;
                scope.onSave({model: scope.model});
                $rootScope.editing = false;
            },
            onSend(htmlFile) {
                testSendModal(htmlFile);
            },
            onError(errorMessage) {
                $rootScope.beefree_error = false;

                if (!$rootScope.beefree_error) {
                    SweetAlert.swal('Please try again.', 'BeeFree plugin error occured.', 'error');
                    $rootScope.beefree_error = true;
                    $state.go($state.current, {}, {reload: true});
                } else {
                    SweetAlert.swal('Corrupt data.', 'Template was corrupt using default.', 'error');
                    scope.notFinal = true;
                    scope.loadDefault();
                    scope.saveNew();
                    $rootScope.beefree_error = false;
                }

            }
        };

        BeePlugin.create(response.token, config, function (beePluginInstance) {

            beePluginInstance.start(jsonTemplate);
            //beePluginInstance.save();
            scope.model.loadingBeeFree = false;
            $rootScope.$broadcast('loadingBeeFree', scope.model.loadingBeeFree);

            scope.model.beePluginInstance = beePluginInstance;
            scope.model.fromTemplate = true;

            scope.loadDefault = function () {
                beePluginInstance.load(response.default_template);
            };

            scope.saveNew = function () {
                beePluginInstance.save();
            }

        });
    }

    function testSendModal(htmlString) {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: sendTestEmailTemplate,
            controller: [
                '$sce',
                '$uibModalInstance',
                function ($sce, $uibModalInstance) {
                    var vm = this;

                    vm.model = {
                        sendTo: '',
                        htmlString: htmlString
                    };

                    vm.send = send;
                    vm.cancel = cancel;
                    vm.trustTemplateHtml = trustTemplateHtml;

                    vm.clear = function () {
                        vm.contact = undefined;
                        vm.rsvp = undefined;
                    };

                    vm.selectContact = function () {
                        SelectBox.get({model: Contact}).then(function (contact) {
                            vm.contact = contact;
                            vm.model.recipients = {type: 'Contact', items: contact.id};
                        }, function (response) { //handle cancel in select box

                        });
                    };

                    vm.selectRsvp = function () {
                        SelectBox.get({model: Guestlist}).then(function (guestlist) {
                            SelectBox.get({model: Rsvp.setGuestlist(guestlist)}).then(function (rsvp) {
                                vm.rsvp = rsvp;
                                vm.model.recipients = {type: 'Rsvp', items: rsvp.id};
                            }, function (response) { //handle cancel in select box

                            });
                        }, function (response) { //handle cancel in select box

                        });
                    };

                    function send() {
                        $uibModalInstance.close(vm.model);
                    }

                    function cancel() {
                        $uibModalInstance.dismiss();
                    }

                    function trustTemplateHtml() {
                        return $sce.trustAsHtml(htmlString);
                    }
                }
            ],
            controllerAs: 'test'
        });

        return modalInstance.result.then(function (email) {
            email.type = 'email';
            email.test = true;

            return Restangular.all("messages").customPOST(email, "test").then(function () {
                SweetAlert.swal(locale.getString('templates.beefree_test_success'), locale.getString('templates.beefree_test_success_message'), 'info');
            }, function (response) {
                return Error.checkError(response);
            });

        }, function (response) {
            return $q.reject(response);
        });

    }
}