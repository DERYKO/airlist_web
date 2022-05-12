class fixTemplate {
    constructor(SweetAlert, $http, $state, locale) {
        this.key = 'fix-template';
        this.title = 'Fix Template';
        this.level = 'highlight';
        this.icon = 'fal fa-wrench';
        this.state = $state;
        this.order = 40;
        this.sweetAlert = SweetAlert;
        this.api = $http;
        this.locale = locale;
    }

    action(template, vm) {
        this.api.post('templates/' + template.id + '/fix-beefree').then(() => {
            this.sweetAlert.swal(this.locale.getString('templates.template_fixed'), this.locale.getString('templates.template_fixed_json'), 'success');
            vm.reloadTemplate();
        });
    }

}

angular
    .module('airlst.templates.main')
    .factory('fixTemplate', [
        'SweetAlert',
        '$http',
        '$state',
        'locale',
        (SweetAlert, $http, $state, locale) => new fixTemplate(SweetAlert, $http, $state, locale)
    ]);

