import modalTemplate from '../views/modal.tpl.html';
import AlMediaSelectorModalController from "./modal-controller";

export default class AlMediaSelectorComponentController {

    constructor($uibModal, $scope, $http, Users, growl) {
        this.modal = $uibModal;
        this.scope = $scope;
        this.api = $http;
        this.users = Users;
        this.growl = growl;
        this.selectedFile = null;
        this.loadingFileInformation = false;

        this._initWatchers();
    }

    startFileSelection() {
        this.modal.open({
            templateUrl: modalTemplate,
            size: 'xlg',
            controller: AlMediaSelectorModalController,
            controllerAs: 'vm',
            resolve: {
                startDirectory: () => {
                    return this.startDirectoryUuid || null;
                },
                allowedMimes: () => {
                    return this.allowedMimes || null;
                }
            }
        }).result.then((selectedData) => {
            this.selectedFile = {
                uuid: _.clone(selectedData.selectedFile.uuid),
                thumbnail: _.clone(selectedData.selectedFile.thumbnail),
                url: _.clone(selectedData.selectedFile.url),
                size: _.clone(selectedData.selectedFile.size),
                name: _.clone(selectedData.selectedFile.name)
            };
            this.scope.$applyAsync();
            this._triggerSelectedUpdate();
        }, () => {

        });
    }

    cleanFile() {
        this.selectedFile = null;
        this._triggerSelectedUpdate();
    }

    clipboardStatus(status) {
        if (status) {
            this.growl.info('Copied');
        } else {
            this.growl.error('Error while copy');
        }
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.currentSelectedFile;
        }, () => {
            if (this.currentSelectedFile && (!this.selectedFile || this.selectedFile.uuid !== this.currentSelectedFile)) {
                this._loadFileInformationForCurrentSelectedFile();
            }
        });
        this.scope.$watch(() => {
            return this.selectedFile;
        }, () => {
            this._triggerSelectedUpdate();
        });

        this.scope.$watch(() => {
            return this.startDirectory;
        }, () => {
            this.users.dispatch('getLoggedIn').then(() => {
                this.startDirectoryUuid = _.get(this.users, `state.company.media.default_directories.${this.startDirectory}`, null)
            });
        })
    }

    _triggerSelectedUpdate() {
        if (this.onFileSelect) {
            if (!this.loadingFileInformation) {
                this.onFileSelect({
                    file: this.selectedFile
                });
            } else {
                this.onFileSelect({
                    file: {
                        uuid: this.currentSelectedFile
                    }
                });
            }

        }
    }

    _loadFileInformationForCurrentSelectedFile() {
        this.loadingFileInformation = true;
        this.api.get(`media/files/${this.currentSelectedFile}`).then((response) => {
            const responseData = _.cloneDeep(response.data.data);
            this.selectedFile = {
                uuid: responseData.uuid,
                url: responseData.url,
                thumbnail: responseData.thumbnail,
                size: responseData.size,
                name: responseData.name
            };
            this.loadingFileInformation = false;
            this._triggerSelectedUpdate();
        }, (response) => {
            console.log('error while loading file', response);
        })
    }

}

AlMediaSelectorComponentController.$inject = [
    '$uibModal',
    '$scope',
    '$http',
    'Users',
    'growl'
];
