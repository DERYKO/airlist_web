export default {
    slug: 'payments',
    prefix: 'billing',
    title: 'Payments',
    visible: [
        'amount',
        'type',
        'status'
    ],
    listview: 'PaymentsListView',
    locales: ['common'],
    actions: {
        // details: {
        //     title: 'Details',
        //     level: 'row',
        //     vm: 'showDetails'
        // },
    }
}