import quill from 'quill';

angular.module('airlst').constant('NG_QUILL_CONFIG', {
    /*
     * @NOTE: this config/output is not localizable.
     */
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

            [{'list': 'ordered'}, {'list': 'bullet'}],

            [{'script': 'sub'}, {'script': 'super'}],     // superscript/subscript

            [{'size': ['small', false, 'large', 'huge']}],
            [{'color': []}, {'background': []}, {'direction': 'rtl'}, {'align': []}],

            ['clean', 'link']
        ]
    },
    theme: 'snow',
    debug: 'warn',
    placeholder: '',
    readOnly: false,
    bounds: document.body,
    scrollContainer: null
}).config([
    'ngQuillConfigProvider',
    'NG_QUILL_CONFIG',

    function (ngQuillConfigProvider, NG_QUILL_CONFIG) {
        ngQuillConfigProvider.set(NG_QUILL_CONFIG)
    }
]);
