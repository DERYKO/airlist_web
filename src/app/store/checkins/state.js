export default {
    slug: 'checkins',
    title: 'Checkins',
    visible: [
        "location",
        "pax_new",
        "pax_old",
        "type",
    ],
    listview: 'CheckinListView',
    locales: ['common'],
    columns: [{
        key: 'contact.id',
        filterable: true,
        type: 'integer'
    }],
    actions: {
        contact: {
            title: 'Contact',
            level: 'row',
            icon: 'fa fa-user',
            vm: 'showContact'
        },
    }
}