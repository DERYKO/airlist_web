import TemplateTypes from '../../../../store/templates/types';

angular
    .module('airlst.templates.types')
    .factory('TemplateTypes', [
        '$injector',
        'TemplateType',
        ($injector, TemplateType) => new TemplateTypes(TemplateType, {
            injector: $injector
        })
    ]);