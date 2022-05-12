import Templates from '../../../../store/templates/main';

angular
    .module('airlst.templates.main')
    .factory('Templates', [
        '$injector',
        'Template',
        ($injector, Template) => new Templates(Template, {
            injector: $injector
        })
    ]);

