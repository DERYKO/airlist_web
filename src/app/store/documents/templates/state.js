export default  {
    slug: 'documents/templates',
    title: 'Document Templates',
    visible: [
        'title',
    ],
    listview: 'DocumentTemplateListView',
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
            icon: 'plus-circle',
            vm: 'addNew'
        },
        details: {
            title: 'Edit',
            level: 'row',
            vm: 'showDetails'
        }
    }
}