export default {
    slug: 'invoices',
    prefix: 'billing',
    title: 'Invoices',
    visible: [
        'subject',
        'contact.full_name',
        'template.title',
        'invoice_number',
        'status'
    ],
    listview: 'InvoicesListView',
    locales: ['common'],
    actions: {
        // create: {
        //     title: 'Add new',
        //     level: 'highlight',
        //     icon: 'plus-circle',
        //     vm: 'addNew'
        // },
        details: {
            title: 'Details',
            level: 'row',
            vm: 'showDetails'
        },
    }
}