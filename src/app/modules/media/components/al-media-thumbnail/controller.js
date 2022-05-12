import modalTemplate from './lightbox-template.tpl.html';

class MediaAlMediaThumbnailComponentCtrl {

    constructor($uibModal, growl) {
        this.modal = $uibModal;
        this.growl = growl;
    }

    handleThumbClick() {
        if (this.file.type === 'image') {
            this.modal.open({
                templateUrl: modalTemplate,
                controller: 'MediaAlMediaThumbnailModalCtrl',
                resolve: {
                    file: () => {
                        return this.file;
                    }
                },
                controllerAs: 'vm',
                size: 'lg'
            }).result.catch(() => {

            })
        }
    }

    clipboardStatus(status) {
        if (status) {
            this.growl.info('Copied');
        } else {
            this.growl.error('Error while copy');
        }
    }
}

MediaAlMediaThumbnailComponentCtrl.$inject = [
    '$uibModal',
    'growl'
];

angular
    .module('airlst.modules.media')
    .controller('MediaAlMediaThumbnailComponentCtrl', MediaAlMediaThumbnailComponentCtrl);

class MediaAlMediaThumbnailModalCtrl {

    constructor($uibModalInstance, file) {
        this.modalInstance = $uibModalInstance;
        this.file = file;
    }

    close() {
        this.modalInstance.close();
    }
}

MediaAlMediaThumbnailModalCtrl.$inject = [
    '$uibModalInstance',
    'file'
];

angular
    .module('airlst.modules.media')
    .controller('MediaAlMediaThumbnailModalCtrl', MediaAlMediaThumbnailModalCtrl);
