export default {
    slug: 'jobs',
    title: 'Background Jobs',
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
    listview: 'LogJobsListView',
    locales: ['common'],
    actions: {
        'mark-as-read': {
            title: '',
            level: 'row',
            class: 'btn btn-default btn-sm fa fa-trash',
            accessor: (job) => {
                return job.status === 'failed' || job.status === 'failed';
            }
        }
    }
}
