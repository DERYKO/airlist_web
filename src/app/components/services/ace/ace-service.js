/**
 * @ngdoc service
 * @name components.service:ACE
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .service('AceEditor', [
        '$http',
        AceEditor
    ]);


const getCompleter = (deposits) => (editor, session, pos, prefix, callback) => {
    const completions = [],
        moduleMappings = {
            guestlists: 'guestlist',
            rsvps: 'rsvp',
            contacts: 'contact'
        };

    _.forEach(deposits, (groups, module) => {
        const moduleKey = _.get(moduleMappings, module, '');

        if (moduleKey !== '') {
            _.forEach(_.get(groups, 'placeholders', []), (placeholder) => {
                completions.push({
                    name: placeholder.name,
                    slug: placeholder.slug,
                    value: `{{ ${moduleKey}.${placeholder.slug} }}`,
                    meta: `${moduleKey} fields`
                });
            });
        }
    });

    return callback(null, completions);
};

function AceEditor($http) {

    this.getEditor = (callback) => $http.get(`deposits`).then(response => {
        callback({
            type: 'ace',
            aceOptions: {
                useWrapMode: false,
                highlightActiveLine: false,
                showGutter: false,
                theme: 'chrome',
                mode: 'twig',
                require: ['language_tools'],
                advanced: {
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                },
                onLoad: function (editor) {
                    editor.$blockScrolling = 'Infinity';
                    const tools = ace.require("ace/ext/language_tools")
                    tools.setCompleters([
                        tools.snippetCompleter,
                        tools.textCompleter,
                        tools.keyWordCompleter,
                        {getCompletions: getCompleter(response.data.data)}
                    ]);
                }
            }
        });
    });

    return this;
}
