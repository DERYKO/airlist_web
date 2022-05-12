export default {
    slug: 'documents',
    title: 'Documents',
    visible: [
        'title'
    ],
    listview: 'DocumentListView',
    locales: ['common'],
    columns: [
        {
            key: 'title',
            main: true,
            filter: function (value) {
                return {
                    field: 'title',
                    operator: 'LIKE',
                    value: '%' + value + '%'
                };
            }
        }
    ],
    actions: {
        create: {
            title: 'Add new',
            level: 'highlight',
            icon: 'plus-circle',
            vm: 'addNew'
        },

    }
}