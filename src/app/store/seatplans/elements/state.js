export default {
    slug: 'seatplans/elements',
    title: 'Seatplan Elements',
    visible: [
        'title',
    ],
    listview: 'SeatplanElementsListView',
    locales: ['common'],
    columns: [
        {
            key: 'title',
            label: 'Title',
            main: true,
        }
    ],
    actions: {
        // create: {
        //     title: 'Add New',
        //     level: 'highlight',
        //     icon: 'plus-circle',
        //     vm: 'addNew'
        // },
        // delete: {
        //     title: 'Delete',
        //     icon: 'fa fa-remove',
        //     level: 'row',
        //     vm: 'deleteSeatplan'
        // },
        // edit: {
        //     title: 'Edit',
        //     icon: 'fa fa-edit',
        //     level: 'row',
        //     vm: 'editSeatplan'
        // },
        // details: {
        //     title: 'Delete',
        //     icon: 'fa fa-search',
        //     level: 'row',
        //     vm: 'showSeatplan'
        // },
    }
}