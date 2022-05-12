export default {
    slug: 'messages',
    title: 'Messages',
    visible: [
        'contact.full_name',
        'send_to',
        'subject',
        'status',
        'created_at'
    ],
    listview: 'MessageListView',
    locales: ['common'],
    columns: [
        {
            key: 'send_to',
            label: 'Recipient',
            main: true,
        },
        {
            key: 'subject',
            main: true,
        }
    ],
    actions: {},
    copyColumns: [
        'send_to'
    ],
    tooltipColumns: [
        'contact_extended.email',
        'contact_extended.business_email',
        'contact_extended.company_name',
        'contact.full_name',
        'template.name',
        'template.email',
        'template.sender_name',
        'subject',
        'send_to',
        'status_information',
        'state_reason',
        'state_response',
        'state_url',
        'state_user_agent'
    ]
}
