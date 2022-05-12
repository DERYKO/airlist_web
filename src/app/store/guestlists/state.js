export default {
    slug: 'guestlists',
    title: 'Guestlists',
    visible: [
        'name',
        'date',
        'sum_pax_planned',
        'count_rsvps_confirmed'
    ],
    listview: 'GuestlistListView',
    locales: ['common'],
    columns: [
        {
            key: 'name',
            main: true
        }
    ],
    requiredTranslations: [
        'guestlists'
    ],
    alertOverrides: {
        bulkDelete: {
            message: 'guestlists.bulk_actions.delete.message'
        }
    }
}
