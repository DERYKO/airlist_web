export default {
    slug: 'templates',
    title: 'Templates',
    visible: [
        'id',
        'business_preferred',
        'name',
        'email',
        'subject',
        'sender_name',
        'bcc',
        'created_at',
    ],
    listview: 'TemplateListView',
    locales: ['common'],
    columns: [
        {
            key: 'name',
            main: true,
            filter: function (value) {
                return {
                    field: 'name',
                    operator: 'LIKE',
                    value: '%' + value + '%'
                };
            }
        }
    ],
    actions: {
    }
}