import template from '../views/extended-duplicates-list.tpl.html';

export default {
    slug: 'rsvps',
    type: 'rsvp-duplicates',
    title: 'RSVP Duplicates',
    visible: [
        // 'contact.first_name',
        // 'contact.last_name',
        // 'contact.email'
    ],
    listview: 'RsvpDuplicatesListView',
    toolsetTemplate: 'asd',
    locales: ['common'],
    extendedListView: true,
    extendedListViewTemplate: template,
    extendedListController: 'RsvpsDuplicatesExtendedListViewCtrl',
    view: {
        mode: 'duplicatesview'
    },
    identifier_field: 'duplicate_information.identifier',
    permanentFields: [],
    templates: {
        'contact.full_name'(row) {
            return row.contact.full_name + (row.has_child ? ' <i class="fal fa-users"></i>' : '');
        }
    },
    actions: {},
    copyColumns: [
        'code',
        'contact.code',
        'contact.full_name',
        'contact.email',
        'contact.business_email',
        'contact.preferred_email',
        'contact.cc_email',
        'contact.nfc_key',
        'contact.web',
        'contact.business_web',
        'contact.facebook_url',
        'contact.xing_url',
        'contact.instagram_url',
        'contact.linkedin_url',
        'contact.stripe_card_id',
        'last_message_subject',
        'last_message_state_information'
    ],
    tooltipColumns: [
        'last_message.subject',
        'last_message.extended_information'
    ]
}
