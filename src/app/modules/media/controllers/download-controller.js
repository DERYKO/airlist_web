export default class DownloadController {

    constructor($injector) {
        this.injector = $injector;
        this.alert = this.injector.get('Alert');
        this.blob = this.injector.get('Blob');
        this.fileSaver = this.injector.get('FileSaver');
        this.api = this.injector.get('$http');
        this.state = this.injector.get('$state');
        this.stateParams = this.injector.get('$stateParams');

        this.loading = true;
        this.error = {
            active: false,
            message: ''
        };

        this.fileInformation = false;

        this.loadFileInformation().then(() => {
            this.downloadFile();
        }, () => {
            this.loading = false;
        });
    }

    loadFileInformation() {
        return this.api.get(`media/files/${this.stateParams.fileUuid}`).then((response) => {
            this.fileInformation = response.data.data;
        }, (e) => {
            this.error = {
                active: true,
                message: 'Error while retrieving file information from api'
            };
        })
    }

    downloadFile() {
        this.api.get(this.fileInformation.url, {responseType: "blob"})
            .then(response => {
                const blob = new this.blob([response.data], {type: response.headers('content-type')});
                this.loading = false;

                this.fileSaver.saveAs(blob, this.fileInformation.name);
                this.finalize();
            }, response => {
                this.error = {
                    active: true,
                    message: 'Error while downloading file'
                };
            });
    }

    finalize() {
        this.alert.success('Download started', `File: ${this.fileInformation.name}`);
        this.state.go('app.dashboard');
    }
}

DownloadController.$inject = [
    '$injector'
];
