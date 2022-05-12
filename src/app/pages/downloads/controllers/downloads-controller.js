/**
 * @ngdoc object
 * @name airlst.controller:DownloadssCtrl
 *
 * @description
 *
 */
class DownloadsCtrl {
    constructor(Alert, Blob, FileSaver, $http, ResourceCommon, $state, $stateParams, growl) {
        this.alert = Alert;
        this.blob = Blob;
        this.fileSaver = FileSaver;
        this.api = $http;
        this.resourceCommon = ResourceCommon;
        this.state = $state;
        this.stateParams = $stateParams;
        this.growl = growl;

        // this.downloadFileByPath(this.stateParams.file)
    }

    downloadFileByType(type, file) {
        this.api.get('download/' + type + '/' + file, {responseType: "blob"})
            .then(response => {
                const blob = new this.blob([response.data], {type: response.headers('content-type')});

                this.fileSaver.saveAs(blob, this.fileInformation.name);
                this.finalize(file);
            }, response => {
                this.error = true;
                this.alert.handle(response);
            });
    }

    downloadFileByPath(path, name) {
        this.resourceCommon.download('files/' + path, name).then(() => {
            this.finalize(name);
        }, response => {
            this.error = true;
            if (response.status === 404) {
                this.alert.error('File not found');
            } else {
                this.alert.handle(response);
            }
        })
    }

    finalize() {
        this.growl.success('File: ' + this.fileInformation.name, {title: 'Download started'});
        this.state.go('app.dashboard');
    }
}


angular
    .module('airlst.downloads')
    .controller('DownloadsCtrl', [
        'Alert',
        'Blob',
        'FileSaver',
        '$http',
        'ResourceCommon',
        '$state',
        '$stateParams',
        'growl',
        DownloadsCtrl
    ]);
