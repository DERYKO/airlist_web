import DocumentTemplates from '../../../../store/documents/templates';

angular
    .module('airlst.contacts')
    .factory('DocumentTemplates', [
        '$injector',
        'DocumentTemplate',
        ($injector, DocumentTemplate) => new DocumentTemplates(DocumentTemplate, {
            injector: $injector
        })
    ]);
