export default  {
        slug: 'passbooks',
        title: 'Passbooks',
        visible: [
            'name',
        ],
        listview: 'PassbookListView',
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
                class: 'btn btn-default',
                level: 'row',
                vm: 'show'
            }
        }
    }
