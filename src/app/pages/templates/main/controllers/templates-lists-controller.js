import '../store/templates'

angular
    .module('airlst.templates.main')
    .controller('TemplatesCtrl', [
        'Templates',
        '$state',
        TemplatesCtrl
    ]);

function TemplatesCtrl(Templates, $state) {
    const vm = this;

    init();

    function init() {
        vm.store = Templates;
        vm.show = showTemplate;
        vm.addNew = addNew;
        vm.store.commit('setVm', vm);
        vm.store.dispatch('loadWorkflows', 'templates::list');
    }

    function addNew() {
        $state.go('app.templates.main.create');
    }

    function showTemplate(payload) {
        $state.go('app.templates.main.details', {id: payload.row.id, store: vm.store}, {location: true});
    }
}
