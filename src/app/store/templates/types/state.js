export default  {
    slug: 'templates/types',
    title: 'Template Types',
    visible: [
        'name',
    ],
    listview: 'TemplateTypeListView',
    locales: ['common'],
    columns: [
        {
            key: 'name',
            label: 'Name',
            main: true,
        }
    ],
    actions: {
        create: {
            title: 'Add new',
            level: 'highlight',
            icon: 'plus-circle',
            vm: 'showCreate'
        },
        edit: {
            title: 'Edit',
            icon: 'icon-pencil',
            level: 'row',
            vm: 'showEdit'
        },
    }
}