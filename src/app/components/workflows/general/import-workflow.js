class ImportRsvpsWorkflow {
    constructor(slug, Alert, $http, $uibModal) {
        this.slug = slug;
        this.alert = Alert;
        this.api = $http;
        this.modal = $uibModal;
        this.key = `import-${ slug }`;
        this.title = `Import ${ _.capitalize(slug) }`;
        this.level = 'selected';
    }
}

export default ImportRsvpsWorkflow;