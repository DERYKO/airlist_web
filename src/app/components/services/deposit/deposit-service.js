import rsvpDeposits from '../../deposits/rsvps.json';

class DepositService {
    constructor(locale, $http) {
        this.locale = locale;
        this.api = $http;
        this.translationPromise = null;
        this.remoteDepositsLoaded = false;
        this.remoteDeposits = {};
        this.getTranslationPromise();
        this._refreshDeposits();
    }

    getTranslatedRsvpStates() {
        return new Promise((resolve, reject) => {
            this.getTranslationPromise().then(() => {
                const out = {};

                for (let i = 0; i < rsvpDeposits.states.length; i++) {
                    const curState = rsvpDeposits.states[i];
                    out[curState] = this.locale.getString('deposits.rsvps.states.' + curState);
                }

                resolve(out);
            }, (rejection) => {
                reject(rejection);
            });
        });
    }

    getTranslationPromise() {
        if (!this.translationPromise) {
            this.translationPromise = this.locale.ready(['deposits']);
        }

        return this.translationPromise;
    }

    getRemoteDeposit(module, identifier, defaultReturn) {
        return this.remoteDepositsPromise.then(() => {
            return _.get(this.remoteDeposits, module + '.' + identifier, defaultReturn);
        });
    }

    _refreshDeposits() {
        this.remoteDepositsLoaded = false;

        this.remoteDepositsPromise = this.api.get('deposits').then((response) => {
            this.remodeDepositsLoaded = true;
            this.remoteDeposits = response.data.data;
        }, () => {
            this.remodeDepositsLoaded = false;
        })
    }
}


angular
    .module('airlst.components')
    .service('Deposit', ['locale', '$http', (locale, $http) => new DepositService(locale, $http)]);

