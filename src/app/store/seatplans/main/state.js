export default {
    slug: 'seatplans',
    title: 'Seatplans',
    visible: [
        'title',
    ],
    listview: 'SeatplanListView',
    locales: ['common'],
    columns: [
        {
            key: 'title',
            label: 'Title',
            main: true,
        }
    ],
    actions: {
        create: {
            title: 'Add New',
            level: 'highlight',
            class: 'btn-success',
            icon: 'plus-circle',
            vm: 'addNew'
        },
        delete: {
            title: 'Delete',
            icon: 'fa fa-remove',
            level: 'row',
            vm: 'deleteSeatplan'
        },
        edit: {
            title: 'Edit',
            icon: 'fa fa-edit',
            level: 'row',
            vm: 'editSeatplan'
        },
        details: {
            title: 'Delete',
            icon: 'fa fa-search',
            level: 'row',
            vm: 'showSeatplan'
        },
    }
}