import singleEmailTemplate from '../../views/workflows/send-single-email.tpl.html'
import {singleEmailCtrl} from './contact/single-email-controller';

/**
 * @ngdoc service
 * @name checkins.factory:emailContact
 *
 * @description
 *
 */
function emailContact(Alert, $uibModal) {
    return {
        key: 'email-contact',
        title: 'Send Email',
        icon: 'envelope',
        order: 30,
        level: 'highlight',
        action(contact) {
            $uibModal.open({
                templateUrl: singleEmailTemplate,
                controller: ['Alert', '$http', 'contact', '$scope', 'Templates', '$uibModalInstance', '$sce', singleEmailCtrl],
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    contact() {
                        return contact;
                    }
                }
            })
                .result.then(null, err => Alert.handle(err));
        }
    }
}

angular
    .module('airlst.contacts')
    .factory('emailContact', [
        'Alert',
        '$uibModal',
        emailContact
    ]);
