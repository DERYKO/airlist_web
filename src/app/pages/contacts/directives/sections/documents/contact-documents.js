import templateUrl from './contact-documents.tpl.html';
import Documents from '../../../../../store/documents/main/index';
import createModalTemplate from '../../../../documents/main/directives/documents/views/editor-modal.tpl.html';

class ContactDocumentsCtrl {
    constructor(model, $injector, $uibModal) {
        this.model = model;
        this.injector = $injector;
        this.uibModal = $uibModal;
    }

    $onInit() {
        this.loadDocuments();
    }

    loadDocuments() {
        this.store = new Documents(this.model, {injector: this.injector});
        this.store.commit('setVisible', ['title', 'created_at']);
        this.store.commit('setPrefix', 'contacts/' + this.contact.id);

        this.store.commit('addAction', {
            key: 'download',
            text: 'Download',
            icon: 'upload',
            level: 'row',
            vm: 'downloadDocument'
        });

        this.store.commit('setVm', this);
    }


    downloadDocument(action) {
        this.model.download({
            id: action.row.id,
            title: action.row.title
        });
    }

    addNew() {
        let modal = this.uibModal.open({
            animation: true,
            templateUrl: createModalTemplate,
            size: 'sm',
            controller: 'DocumentCreateModalCtrl',
            controllerAs: 'vm',
            resolve: {
                model: () => {
                    return this.model.setContactId(this.contact.id);
                },
                closeFunction: () => {
                    return () => {
                        this.store.dispatch('getData');
                        modal.close();
                    };
                }
            }
        });
    }
}

ContactDocumentsCtrl.$inject = ['Document', '$injector', '$uibModal'];

angular
    .module('airlst.contacts')
    .component('contactDocuments', {
        bindings: {
            contact: '='
        },
        controller: ContactDocumentsCtrl,
        controllerAs: 'vm',
        templateUrl: templateUrl
    });

