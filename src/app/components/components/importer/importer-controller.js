import Papa from 'papaparse';

class ImporterCtrl {
    constructor(Alert, Categories, $http, $state) {
        this.api = $http;
        this.alert = Alert;
        this.categoriesStore = Categories.reset({persist: false});
        this.state = $state;
        this.prefixUrl = '';
        this.column_fields = [];
        this.csvImportData = '';
        this.ignored_fields = {
            'rsvp' : [
                'contact.blacklist',
                'contact.blacklist_reason',
                'contact.checkins_120',
                'contact.checkins_30',
                'contact.checkins_all',
                'contact.block_email',
                'contact.full_name',
                'contact.has_duplicates',
                'contact.id',
                'contact.is_duplicate',
                'contact.last_checked_in_at',
                'contact.last_invoice_at',
                'contact.last_invoice_number',
                'contact.notify_on_register',
                'contact.notify_on_checkin',
                'contact.notify_email',
                'contact.notify_sms',
                'contact.optin',
                'contact.optin_at',
                'contact.optin_ip',
                'contact.paid',
                'contact.rsvps_120',
                'contact.rsvps_30',
                'contact.rsvps_all',
                'contact.show_rate',
                'contact.block_sms',
                'contact.stripe_card_id',
                'contact.subscription',
                'contact.subscription_start_date',
                'contact.subscription_status',
                'contact.uid',
                'contact.unmerged_flag',
                'created_at',
                'deleted_at',
                'guestlist_id',
                'id',
                'last_message_state_information',
                'last_message_state',
                'last_message_subject',
                'uid',
                'updated_at',
            ],
            'contact': [
                'checkins_120',
                'checkins_30',
                'checkins_all',
                'full_name',
                'has_duplicates',
                'id',
                'is_duplicate',
                'last_checked_in_at',
                'last_invoice_at',
                'last_invoice_number',
                'last_paid_at',
                'rsvps_120',
                'rsvps_30',
                'rsvps_all',
                'show_rate',
                'uid',
                'unmerged_flag',
            ]
        };
    }

    $onInit() {

        this.initialize();
        this.setupSteps();
        this.setupControls();
    }

    initialize() {
        this.samples = [];
        this.model = {
            type: this.type,
            columns: [],
            data: [],
            addressbook: this.type === 'contact',
            categories: [],
            guestlists: [],
            default_pax_planned: 1,
            default_status: 'listed',
            field_config: this.type == 'rsvp' ? {
                maxItems: 1,
                optgroupField: 'group',
                optgroups: [
                    {value: 'rsvp', label: 'Rsvp'},
                    {value: 'contact', label: 'Contact'}
                ],
                render: {
                    optgroup_header: function (data, escape) {
                        return '<div class="optgroup-header"><strong>' + escape(data.label) + '</strong></div>';
                    }
                }
            } : {
                maxItems: 1,
            },
            rsvp_statuses: [
                {
                    value: 'requested',
                    label: 'Requested'
                },
                {
                    value: 'listed',
                    label: 'Listed'
                },
                {
                    value: 'invited',
                    label: 'Invited'
                },
                {
                    value: 'confirmed',
                    label: 'Confirmed'
                },
                {
                    value: 'cancelled',
                    label: 'Cancelled'
                },
                {
                    value: 'waitlisted',
                    label: 'Waitlisted'
                }
            ]
        };
        if (this.type == 'rsvp') {
            this.prefixUrl = 'guestlists/' + this.state.params.gid + '/';
        }
        this.csv = '';
        this.parsed = {};
    }

    setupSteps() {
        this.steps = [
            {
                id: 'data',
                label: 'Select Data',
                disabled: false,
                current: true,
                completed: false,
                index: 1,
            },
            {
                id: 'mapping',
                label: 'Map Data',
                disabled: false,
                current: false,
                completed: false,
                index: 2
            },
            {
                id: 'review',
                label: 'Review',
                disabled: false,
                current: false,
                completed: false,
                index: 3
            }
        ];
        this.currentStep = this.steps[0];
    }

    setupControls() {
        this.pasteArea = {
            type: 'ace',
            aceOptions: {
                useWrapMode: false,
                highlightActiveLine: false,
                showGutter: false,
                theme: 'chrome',
                mode: 'text',
                require: ['ace/ext/language_tools'],
                advanced: {
                    enableBasicAutocompletion: false,
                    enableSnippets: false,
                    enableLiveAutocompletion: false
                },
                onLoad: function (editor) {
                    editor.$blockScrolling = 'Infinity';
                }
            }
        };

        this.headersToggle = {
            type: 'boolean'
        };

        this.categories = {
            store: this.categoriesStore,
            maxItems: 25
        };
    }

    displayCategories() {
        return this.categoriesStore.getters.selectedRows.map(r => r.name).join(', ');
    }

    processAndValidateMapping() {
        let is_valid = true;

        if (this.type == 'rsvp') {
            // status validation
            if ((this.model.default_status && this.model.default_status !== "") || this.model.columns.includes('status')) {
                let status_key = this.findKey(this.model.columns, 'status');
                let validation_status = false;
                this.model.data.forEach(function (value, key) {
                    if (value[status_key] == '') {
                        validation_status = true;
                    }
                });
                if (validation_status && !this.model.default_status) {
                    is_valid = false;
                    this.alert.error('Import Error', 'Please provide a default value for the rsvp status. It will be used when no specific value is provided on a record to be imported.');
                }
            } else {
                if (this.model.default_status === undefined || this.model.default_status == "") {
                    is_valid = false;
                    this.alert.error('Import Error', 'Please provide a default value for the rsvp status. It will be used when no specific value is provided on a record to be imported.');
                } else {
                    is_valid = true;
                }
            }
            // pax _planned validation
            if (this.model.default_pax_planned === undefined) {
                is_valid = false;
                this.alert.error('Import Error', 'Please provide a default value for pax planned. It will be used when no specific value is provided on a record to be imported.');
            } else {
                if (this.model.default_pax_planned === '') {
                    is_valid = false;
                    this.alert.error('Import Error', 'Please provide a default value for pax planned. It will be used when no specific value is provided on a record to be imported.');
                }
            }
        }

        if (is_valid) {
            return true;
        }
    }

    findKey(obj, value) {
        let key = null;
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (obj[prop] === value) {
                    key = prop;
                }
            }
        }
        return key;
    };

    uploadCsvFileData() {
        let value = '';
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            this.csvImportData = reader.result;
            this.setCsvFileData();
        });
        reader.readAsText(this.model.inputFile);
    }

    setCsvFileData() {
        this.csv = this.csvImportData.trim();

    }

    isIgnoredField(field) {
        let ignoredFields = this.ignored_fields[this.type];
        if (ignoredFields && ignoredFields.includes(field)) {
            return true;
        } else {
            return false;
        }
    };

    processAndValidateData() {
        this.parsed = Papa.parse(this.csv, {skipEmptyLines: true});

        _.each(this.fields, (column, index) => {
            if (column.key.indexOf('guestlist.') == -1
                && column.key.indexOf('parent_rsvp.') == -1
                && column.key.indexOf('parent_rsvp_contact') == -1
                && column.key.indexOf('contact.preferred_') == -1
                && column.key.indexOf('contact.age') == -1
                && !this.isIgnoredField(column.key)) {
                    let columnGroup = 'rsvp';
                    if (column.key.indexOf('contact.') >=0) {
                        column.label = column.label.replace("Contact - ", "");
                        columnGroup = 'contact';
                    }

                    this.column_fields.push(
                        {
                            group: columnGroup,
                            value: column.key,
                            label: column.label
                        }
                    );
            }
        });
        if (this.parsed.data.length) {

            this.parsed.data = _.map(this.parsed.data, row => _.map(row, cell => cell.trim()));

            _.each(this.parsed.data[0], (field, index) => {
                this.model.columns[index] = 'skip';
                if (this.hasHeaders) {
                    this.model.columns[index] = _.get(_.find(this.fields, {key: field}, {}), 'key', 'skip');
                }
            });

            this.samples = [];

            _(this.parsed.data)
                .take(4)
                .reject((row, i) => this.hasHeaders && i === 0)
                .each(row => {
                    _.each(row, (cell, index) => {
                        if (!this.samples[index]) {
                            this.samples[index] = [];
                        }
                        this.samples[index].push(cell);
                    });
                });

            this.model.data = this.hasHeaders ? this.parsed.data.splice(1) : this.parsed.data


            return true;
        } else {
            this.alert.error('Import Error', 'You need to insert data for the import');
        }
    }

    save() {
        this.api.post(this.prefixUrl + this.importUrl, this.model)
            .then(response => {
                this.alert.info('Import started', 'You import was scheduled and will start in the next seconds');
                this.onSuccess()
            }, (response) => {
                if(response.data.status_code === 400 && response.data.message === 'duplicate_code_found') {
                    this.alert.error('Upload failed', 'Your upload contains duplicate booking codes');
                } else {
                    this.alert.handle(response)
                }
            });
    }

    nextStep() {
        let validator = `processAndValidate${ _.capitalize(this.currentStep.id) }`;
        if (!this[validator] || this[validator]()) {
            this.currentStep.completed = true;
            this.currentStep.current = false;
            this.currentStep = _.find(this.steps, {index: this.currentStep.index + 1});
            this.currentStep.current = true;
        }
    }

    previousStep() {
        this.currentStep.completed = false;
        this.currentStep.current = false;
        this.currentStep = _.find(this.steps, {index: this.currentStep.index - 1});
        this.currentStep.completed = false;
        this.currentStep.current = true;

    }

    cancel() {
        if (this.type == 'rsvp') {
            this.state.go('app.guestlists.index');
        } else {
            this.state.go('app.contacts.index');
        }
    }
}

export default ImporterCtrl;
