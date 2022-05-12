export default {
    archived: false,
    persist: true,
    exportSlugOverride: undefined,
    prefix: undefined,
    suffix: undefined,
    dataUrl: undefined,
    definitionsUrl: undefined,
    visible: [],
    addedFields: [],
    columns: [],
    stats: [],
    extraColumns: [],
    identifier_field: 'id',
    permanentFields: ['id'],
    filters: {},
    permanentFilters: {},
    autoFilters: {},
    showFilters: false,
    sort: {},
    tasks: [],
    keyword: undefined,
    pagination: {
        perPage: 100,
        page: 1
    },
    pagesizes: [
        25,
        100,
        500,
        1000
    ],
    toolsetTemplate: undefined,
    extendedListView: false,
    extendedListViewTemplate: '',
    extendedListController: '',
    currentExtendedRow: -1,
    overrideSideNavActions: true,
    data: [],
    selection: {
        selectAll: false,
        selectedRows: {},
    },
    locales: ['common'],
    actions: {
        table_options: {
            title: 'Table Options',
            level: 'settings',
            icon: 'pe-7s-settings',
            manager: 'tableOptions'
        },
        clear_selected: {
            title: 'Clear Selection',
            level: 'selected',
            manager: 'clearSelection'
        },
        load_presets: {
            title: 'Load Preset',
            level: 'settings',
            manager: 'loadPreset'
        },
        save_presets: {
            title: 'Save Preset',
            level: 'settings',
            manager: 'savePreset'
        }
    },
    workflowKey: undefined,
    vm: undefined,
    pusherEvents: [
        'bulk_update_resources',
        'bulk_archive_resources',
        'bulk_delete_resources',
        'bulk_restore_resources'
    ],
    emptyListActions: [],
    copyColumns: [],
    tooltipColumns: [],
    alertOverrides: {},
    requiredTranslations: []
}
