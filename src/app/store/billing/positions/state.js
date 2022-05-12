export default {
    slug: 'billing/positions',
    title: 'Positions',
    visible: [
        'title',
    ],
    listview: 'PositionsListView',
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
            title: 'Add new',
            level: 'highlight',
            class: 'btn-success',
            icon: 'plus-circle',
            vm: 'addNew'
        },
        details: {
            title: 'Details',
            class: 'btn btn-default',
            level: 'row',
            vm: 'edit'
        },
    }
}