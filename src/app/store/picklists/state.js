export default {
    slug: 'picklists',
    title: 'Picklists',
    visible: [
        'name',
        'contact_count'
    ],
    listview: 'PicklistListView',
    locales: ['common'],
    columns: [
        {
            key: 'name',
            label: 'Name',
            main: true,
        }
    ],
    actions: {
        // create: {
        //     title: 'Add new',
        //     level: 'highlight',
        //     icon: 'plus-circle',
        //     vm: 'addNew'
        // },
        // showContacts: {
        //     title: 'Show Contacts',
        //     level: 'row',
        //     vm: 'showContacts'
        // }
    }
}
