export default {
    slug: 'tickets',
    title: 'PDF Tickets',
    visible: [
        'name',
    ],
    listview: 'TicketListView',
    locales: ['common'],
    columns: [
        {
            key: 'name',
            label: 'Name',
            main: true,
        }
    ],
    actions: {
        details: {
            title: 'Details',
            level: 'row',
            vm: 'show'
        }
    }
}
