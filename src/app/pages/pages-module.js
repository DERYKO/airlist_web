

import './auth/auth-module';
import './dashboard/dashboard-module';
import './guestlists/guestlists-module';
import './contacts/contacts-module';
import './categories/categories-module';
import './tickets/tickets-module';
import './messages/messages-module';
import './picklists/picklists-module';
import './users/users-module';
import './seatplans/seatplans-module';
import './settings/settings-module';
import './toolbox/toolbox-module';
import './passbooks/passbooks-module';
import './queue/queue-module';
import './statistics/statistics-module';
import './documents/documents-module';
import './downloads/downloads-routes';
import './billing/billing-module';

import './templates/templates-module';

angular.module('airlst.pages', [
    'airlst.auth',
    'airlst.dashboard',
    'airlst.guestlists',
    'airlst.contacts',
    'airlst.categories',
    'airlst.templates',
    'airlst.tickets',
    'airlst.messages',
    'airlst.picklists',
    'airlst.users',
    'airlst.seatplans',
    'airlst.settings',
    'airlst.toolbox',
    'airlst.passbooks',
    'airlst.queue',
    'airlst.statistics',
    'airlst.documents',
    'airlst.downloads',
    'airlst.billing'
]);

require('./pages-routes.js');
