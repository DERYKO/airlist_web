/**
 * @ngdoc service
 * @name tickets.factory:Ticket
 *
 * @description
 *
 */
angular
    .module('airlst.tickets')
    .factory('Ticket', [
        'locale',
        'Resource',
        'ResourceCommon',
        Ticket
    ]);

function Ticket(locale, Resource, ResourceCommon) {
    var $model = Resource.make('tickets');

    $model.title = ' Tickets';

    $model.locales = ['tickets'];

    locale.ready($model.locales).then(function () {
        $model.schema = {
            type: 'object',
            title: locale.getString('tickets.title_details'),
            properties: {
                name: {
                    title: locale.getString('tickets.name'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                styling: {
                    title: locale.getString('tickets.styling'),
                    type: 'object',
                    listview: false,
                    properties: {
                        size: {
                            title: locale.getString('tickets.size'),
                            type: 'object',
                            properties: {
                                length: {
                                    title: locale.getString('tickets.length'),
                                    type: 'string',
                                    default: '75'
                                },
                                width: {
                                    title: locale.getString('tickets.width'),
                                    type: 'string',
                                    default: '180'
                                }
                            }
                        },
                        qrCode: {
                            title: locale.getString('tickets.qrCode'),
                            type: 'object',
                            properties: {
                                size: {
                                    title: locale.getString('tickets.size'),
                                    type: 'string',
                                    default: '35'
                                },
                                top: {
                                    title: locale.getString('tickets.top'),
                                    type: 'string',
                                    default: '20'
                                },
                                left: {
                                    title: locale.getString('tickets.left'),
                                    type: 'string',
                                    default: '100'
                                }
                            }
                        },
                        text: {
                            title: locale.getString('tickets.text'),
                            type: 'object',
                            properties: {
                                size: {
                                    title: locale.getString('tickets.font_size'),
                                    type: 'string',
                                    default: '5'
                                },
                                color: {
                                    title: locale.getString('tickets.color'),
                                    type: 'string',
                                    default: '#333'
                                },
                                top: {
                                    title: locale.getString('tickets.top'),
                                    type: 'string',
                                    default: '30'
                                },
                                left: {
                                    title: locale.getString('tickets.left'),
                                    type: 'string',
                                    default: '20'
                                }
                            }
                        }
                    }
                },
                text_content: {
                    title: locale.getString('tickets.text_content'),
                    type: 'string',
                    description: 'Fields have to be wrapped using handle bars as in example {{ rsvps.code }}',
                    listview: 'hidden'
                },
                background_image: {
                    title: locale.getString('tickets.background_image'),
                    listview: 'hidden',
                    type: 'string',
                    format: 'image',
                    'x-schema-form': {
                        text: false,
                        uploader: true,
                        type: 'imageuploader',
                        class: 'img-responsive',
                        preview: false
                    }
                }
            },
            required: ['name']
        };
    });

    $model.form = [
        'name',
        'background_image',
        'styling.size.length',
        'styling.size.width',
        'styling.qrCode.size',
        'styling.qrCode.top',
        'styling.qrCode.left',
        'styling.text.size',
        'styling.text.color',
        'styling.text.top',
        'styling.text.left',
        {
            key: 'text_content',
            type: 'ace',
            aceOptions: {
                useWrapMode: false,
                highlightActiveLine: false,
                showGutter: false,
                theme: 'chrome',
                mode: 'twig',
                require: ['ace/ext/language_tools'],
                advanced: {
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                },
                onLoad: function (editor) {
                    editor.$blockScrolling = 'Infinity';
                    ace.require("ace/ext/language_tools").addCompleter({
                        getCompletions: ResourceCommon.getCompletions
                    });
                }
            }
        }
    ];

    return $model;
}