export default {
    slug: 'queue',
    title: 'Job Logs',
    visible: [
        'status',
        'job_class',
        'master_user.full_name',
        'sub_jobs_count',
        'succeeded_sub_jobs_count',
        'failed_sub_jobs_count',
        'meta_data',
        'scheduled_at',
        'finished_at',
    ],
    listview: 'JobLogsListView',
    locales: ['common'],
    columns: [],
    actions: {},
    copyColumns: [
        'meta_data'
    ],
    tooltipColumns: [
        'meta_data'
    ]
}
