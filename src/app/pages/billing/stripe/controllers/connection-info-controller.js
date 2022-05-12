import payoutInfoModalTemplate from '../views/payout-info-modal.tpl.html';

class ConnectionInfoCtrl {

    constructor(http, Env, nav, acl, $uibModal) {
        this.http = http;
        this.env = Env;
        this.nav = nav;
        this.acl = acl;
        this.modal = $uibModal;

        this.loading = false;
        this.error = null;
        this.connectionStatus = false;
        this.initConnectionData = null;
        this.connectionInfo = null;
        this.payouts = [];
        this.updateCustomActions();
        this.changeView('General');
    }

    loadCurrentConnectionStatus() {
        this.loading = true;
        this.http.get('billing/stripe/connection/check').then((response) => {
            this.loading = false;
            this.connectionInfo = response.data.data;
            switch (this.connectionInfo.status) {
                case 'ok':
                    this.connectionStatus = true;
                    this.updateCustomActions();
                    break;
                default:
                case 'error':
                    this.initConnection();
                    break;
            }
        }, () => {
            this.loading = false;
            this.error = 'there was an error while checking the connection to stripe';
        });
    }

    initConnection() {
        let url = this.env.url + 'billing/stripe';
        this.http.post('billing/stripe/connection/start', {
            redirect_uri: url
        }).then((response) => {
            this.loading = false;
            this.initConnectionData = response.data;
        }, () => {
            this.loading = false;
            this.error = 'Error while starting connection';
        })
    }

    updateCustomActions() {
        let customs = [
            {
                label: 'General',
                active: (this.currentView === 'General'),
                icon: 'desktop',
                order: 5,
                action: () => {
                    this.changeView('General');
                }
            }
        ];

        if (!this.loading && this.connectionStatus) {
            customs.push({
                label: 'Payouts',
                active: (this.currentView === 'Payouts'),
                icon: 'euro-sign',
                order: 15,
                action: () => {
                    this.changeView('Payouts');
                }
            });
        }

        let customsToSet = [];

        _.forEach(customs, (custom) => {
            if (!custom.right
                || typeof custom.rights === 'string' && this.acl.hasRight(custom.right)) {
                customsToSet.push(custom);
            } else {
                let allTrue = true;
                for (let i = 0; i < custom.right.length; i++) {
                    if (!this.acl.hasRight(custom.right[i])) {
                        allTrue = false;
                    }
                }

                if (allTrue) {
                    customsToSet.push(custom);
                }
            }
        });

        customs.sort((a, b) => {
            return a.order - b.order;
        });

        this.nav.setSideNavCustoms(customs);
    }

    loadPayouts() {
        this.loading = true;
        this.http.get('billing/stripe/payouts').then((response) => {
            this.loading = false;
            this.payouts = response.data.data;
        }, () => {
            this.loading = false;
            this.error = 'there was an error while loading the payouts';
        });
    }

    showPayoutDetails(payout) {
        this.modal.open({
            animation: true,
            size: 'lg',
            templateUrl: payoutInfoModalTemplate,
            controller: ['$uibModalInstance', 'payout', function($uibModalInstance, payout){
                const vm = this;

                vm.payout = payout;
                vm.close = function(){
                    $uibModalInstance.dismiss();
                }
            }],
            controllerAs: 'vm',
            resolve: {
                payout: function () {
                    return payout;
                }
            }
        });
    }

    changeView(view) {
        this.currentView = view;
        this.updateCustomActions();
        switch (this.currentView) {
            case 'General':
                this.loadCurrentConnectionStatus();
                break;
            case 'Payouts':
                this.loadPayouts();
                break;
        }
    }
}

ConnectionInfoCtrl.$inject = ['$http', 'Env', 'NavService', 'Acl', '$uibModal'];

angular
    .module('airlst.billing.stripe')
    .controller('ConnectionInfoCtrl', ConnectionInfoCtrl);