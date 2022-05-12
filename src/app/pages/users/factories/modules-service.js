import addressbook from '../data/modules/addressbook.json';
import addressbook_categories from '../data/modules/addressbook_categories.json';
import billing from '../data/modules/billing.json';
import billing_subscriptions from '../data/modules/billing_subscriptions.json';
import documents from '../data/modules/documents.json';
import general from '../data/modules/general.json';
import guestlists from '../data/modules/guestlists.json';
import membercards from '../data/modules/membercards.json';
import messaging from '../data/modules/messaging.json';
import passbooks from '../data/modules/passbooks.json';
import picklists from '../data/modules/picklists.json';
import presets from '../data/modules/presets.json';
import seatplans from '../data/modules/seatplans.json';
import statistics from '../data/modules/statistics.json';
import tickets from '../data/modules/tickets.json';

class CompanyModule {

    constructor() {
        this.modules = _([
            addressbook,
            addressbook_categories,
            billing,
            billing_subscriptions,
            documents,
            general,
            guestlists,
            membercards,
            messaging,
            passbooks,
            picklists,
            presets,
            seatplans,
            statistics,
            tickets,
        ])
        // .map(module => {
        //     module.rights = _.keyBy(module.rights, 'identifier');
        //     return module;
        // })
            .keyBy('identifier')
            .value();
    }

    getModules(modules) {
        return _.pick(this.modules, modules)
    }
}

export default new CompanyModule;