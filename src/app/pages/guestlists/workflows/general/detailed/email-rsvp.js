import singleEmailTemplate from '../../../views/workflows/send-single-email.tpl.html'
import {singleEmailCtrl} from './controllers/single-email-controller';

/**
 * @ngdoc service
 * @name checkins.factory:emailContact
 *
 * @description
 *
 */


function emailRsvp(Alert, $uibModal) {
    return {
        key: 'email-rsvp',
        title: 'Send Email',
        icon: 'envelope',
        level: 'highlight',
        order: 30,
        action(rsvp) {
            $uibModal.open({
                templateUrl: singleEmailTemplate,
                controller: ['Alert', '$http', 'rsvp', '$scope', 'Templates', '$uibModalInstance', '$sce', singleEmailCtrl],
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    rsvp() {
                        return rsvp;
                    }
                }
            })
                .result.then(null, err => Alert.handle(err));
        }
    }
}

angular
    .module('airlst.guestlists')
    .factory('emailRsvp', [
        'Alert',
        '$uibModal',
        emailRsvp
    ]);
