import Documents from '../../../../store/documents/main';

angular
    .module('airlst.contacts')
    .factory('Documents', [
        '$injector',
        'Document',
        ($injector, Document) => new Documents(Document, {
            injector: $injector
        })
    ]);
