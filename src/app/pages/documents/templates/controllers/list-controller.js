/**
 * @ngdoc object
 * @name contacts.documents.templates:DocumentsTemplatesListCtrl
 *
 * @description
 *
 */
import DocumentTemplates from '../../../../store/documents/templates/index';

angular
    .module('airlst.documents.templates')
    .controller('DocumentsTemplatesListCtrl', [
        'DocumentTemplate',
        '$state',
        '$injector',
        DocumentsTemplatesListCtrl
    ]);

function DocumentsTemplatesListCtrl(DocumentTemplate, $state, $injector) {
    const vm = this;

    vm.name = 'DocumentsTemplatesListView';
    vm.model = DocumentTemplate;
    vm.loading = false;
    vm.store = new DocumentTemplates(DocumentTemplate, {injector: $injector});
    vm.addNew = addNew;
    vm.showDetails = details;
    vm.store.commit('setVm', vm);

    function addNew() {
        $state.go('app.documents.templates.create', {store: vm.store});
    }

    function details(action) {
        console.log(action);
        $state.go('app.documents.templates.details', {id: action.row.id, store: vm.store});
    }
}