import Clipboard from 'clipboard';
import templateUrl from '../../views/guestlist-landing-link.tpl.html';

/**
 * @ngdoc service
 * @name checkins.factory:guestlistLandingLink
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('guestlistLandingLink', [
        '$uibModal',
        'Users',
        guestlistLandingLink
    ]);

function guestlistLandingLink($uibModal, Users) {
    return {
        key: 'guestlist-landing-link',
        title: 'Landing Page',
        icon: 'link',
        order: 60,
        level: 'highlight',
        action({}, store) {

            $uibModal.open({
                templateUrl,
                controllerAs: 'vm',
                controller: ['link', '$uibModalInstance', function (link, $uibModalInstance) {
                    var vm = this;
                    vm.link = link;
                    vm.close = $uibModalInstance.dismiss;
                    const clipboard = new Clipboard('.clipboard');

                    clipboard.on('success', (e) => {
                        vm.message = 'Link successfully copied';
                    });

                    clipboard.on('error', (e) => {
                        console.log(e);
                        vm.message = 'Link has not be copied, try again!';
                    });

                }],
                resolve: {
                    link() {
                        return _.get(Users.state.company, 'settings.lp-api.ext_reg_domain') + store.state.vm.guestlist.uid;
                    }
                },
            }).result.then(null, () => {
            });
        }
    }
}
