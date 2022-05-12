import selectEmailModalTemplate from '../../views/select-email-modal.tpl.html';


/**
 * @ngdoc service
 * @name components.service:SelectBox
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .service('ResourceCommon', [
        'Category',
        'Contact',
        'Env',
        'Error',
        'FileSaver',
        '$http',
        '$injector',
        'Message',
        '$q',
        'Restangular',
        'Rsvp',
        'SelectBox',
        'SweetAlert',
        '$uibModal',
        'Upload',
        ResourceCommon
    ]);

function ResourceCommon(Category, Contact, Env, Error, FileSaver, $http, $injector, Message, $q, Restangular, Rsvp, SelectBox, SweetAlert, $uibModal, Upload) {
    const service = this;

    service.sendEmail = function (contacts, isSingleEmail, sendToEmail, returnWithoutSending) {
        const modalInstance = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: selectEmailModalTemplate,
            controller: [
                '$sce',
                '$uibModalInstance',
                function ($sce, $uibModalInstance) {
                    var vm = this;

                    vm.form = ['*'];
                    vm.model = {
                        attach_ticket: false,
                        attach_passbook: false,
                        attach_files: true
                    };
                    if (isSingleEmail) {
                        vm.model.send_to_email = sendToEmail;
                    }
                    vm.send = send;
                    vm.cancel = cancel;
                    vm.trustTemplateHtml = trustTemplateHtml;
                    vm.isSingleEmail = isSingleEmail;

                    vm.selectTemplate = function () {
                        $injector.get('ResourceSelect')
                                 .template(true).then(function (template) {
                            $injector.get('Template')
                                     .one(template.id).get({include: 'ticket,files'}).then(function (template) {
                                vm.template = template;
                            });
                            vm.model.template_id = template.id;
                        }, function (response) { //handle cancel in select box

                        });
                    };

                    vm.updateSendTo = function (email) {
                        console.log('new email', email);
                    };

                    function send(template) {
                        $uibModalInstance.close(template);
                    }

                    function cancel() {
                        $uibModalInstance.dismiss('cancel');
                    }

                    function trustTemplateHtml(string) {
                        return $sce.trustAsHtml(string);
                    }
                }
            ],
            controllerAs: 'email'
        });

        return modalInstance.result.then(function (email) {
            if (returnWithoutSending) {
                return email;
            }
            email.keys = contacts;
            email.type = 'email';

            return Message.post(email);
        }, function (response) {
            return $q.reject(response);
        });
    };

    service.getCompletions = function (editor, session, pos, prefix, callback) {
        var payments = [], contacts = [], guestlists = [], rsvps = [], Guestlist = $injector.get('Guestlist');

        Guestlist.getFields().then(function (fields) {
            guestlists = fields.map(function (field) {
                return {
                    name: field.name,
                    slug: field.slug,
                    value: '{{ guestlist.' + field.slug + ' }}',
                    meta: "guestlist fields"
                };
            });
            Contact.getFields().then(function (fields) {
                contacts = fields.map(function (field) {
                    return {
                        name: field.name,
                        slug: field.slug,
                        value: '{{ contact.' + field.slug + ' }}',
                        meta: "contact fields"
                    };
                });
                Rsvp.getFields().then(function (fields) {
                    rsvps = _.reject(fields, function (field) {
                        if (_.startsWith(field.slug, 'custom_')) {
                            return _.find(contacts, {name: field.name}) || _.startsWith(field.slug, 'contact_');
                        } else {
                            return _.find(contacts, {name: field.name}) || _.find(contacts, {
                                                                            name: field.name,
                                                                            slug: field.slug
                                                                        }) ||
                                   _.startsWith(field.slug, 'contact_');
                        }
                    }).map(function (field) {
                        return {
                            name: field.name,
                            value: '{{ rsvp.' + field.slug + ' }}',
                            meta: "rsvp fields"
                        };
                    });

                    return callback(null, _(rsvps).concat(contacts).concat(guestlists).concat(payments).concat([
                        {
                            name: 'Rsvp QR Code link',
                            value: '{{ rsvp.qrcode_link}}',
                            meta: 'rsvp fields'
                        },
                        {
                            name: 'Full Salutation',
                            value: '{{ contact.full_salutation }}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Address',
                            value: '{{contact.preferred_address}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Address 2',
                            value: '{{contact.preferred_address_2}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Street',
                            value: '{{contact.preferred_street}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Street 2',
                            value: '{{contact.preferred_street_2}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Zip',
                            value: '{{contact.preferred_zip}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred City',
                            value: '{{contact.preferred_city}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Country',
                            value: '{{contact.preferred_country}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Phone',
                            value: '{{contact.preferred_phone}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Phone 2',
                            value: '{{contact.preferred_phone_2}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Fax',
                            value: '{{contact.preferred_fax}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Web',
                            value: '{{contact.preferred_web}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Email',
                            value: '{{contact.preferred_email}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Company Name',
                            value: '{{contact.preferred_company_name}}',
                            meta: 'contact fields'
                        },
                        {
                            name: 'Preferred Department',
                            value: '{{contact.preferred_department}}',
                            meta: 'contact fields'
                        }
                    ]).value());
                });
            });
        });
    };

    service.sendSms = function (contacts) {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'core/views/sms-modal.tpl.html',
            controller: function ($auth, $sce, $uibModalInstance, $scope) {
                var vm = this;

                vm.content = "";
                vm.send = send;
                vm.cancel = cancel;
                vm.content = {
                    content: '',
                    sender: null
                };

                vm.messageValidation = {
                    isGsm: true,
                    limit: 140,
                    length: 0,
                    smsCount: 0
                };

                $scope.$watch('sms.content.content', function () {
                    var gsm = "@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞ^{}\[~]|€ÆæßÉ!\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà\n ",
                        gsmDoubleBytes = '€~{}[]^|\\',
                        gsmCheck = true,
                        strLengthPerChar = 0,
                        strLengthGsm = 0;

                    for (var i = 0, n = vm.content.content.length; i < n; i++) {
                        strLengthPerChar++;
                        strLengthGsm++;
                        var curChar = vm.content.content[i];
                        if (gsm.indexOf(curChar) !== -1) {
                            if (gsmDoubleBytes.indexOf(curChar) !== -1) {
                                strLengthGsm++;
                            }
                        } else {
                            gsmCheck = false;
                        }
                    }

                    if (gsmCheck) {
                        vm.messageValidation = {
                            isGsm: true,
                            limit: 140,
                            length: strLengthGsm,
                            smsCount: (strLengthGsm > 0) ? Math.ceil(strLengthGsm / 140) : 0
                        };
                    } else {
                        vm.messageValidation = {
                            isGsm: false,
                            limit: 70,
                            length: strLengthPerChar,
                            smsCount: (strLengthPerChar > 0) ? Math.ceil(strLengthPerChar / 70) : 0
                        };
                    }
                });

                vm.aceOptions = {
                    useWrapMode: false,
                    highlightActiveLine: false,
                    showGutter: false,
                    theme: 'chrome',
                    mode: 'ace/mode/twig',
                    require: ['ace/ext/language_tools'],
                    advanced: {
                        enableBasicAutocompletion: true,
                        enableSnippets: true,
                        enableLiveAutocompletion: true
                    },
                    onLoad: function (editor) {
                        editor.$blockScrolling = 'Infinity';
                        ace.require("ace/ext/language_tools").addCompleter({
                            getCompletions: service.getCompletions
                        });
                    }
                };

                $auth.getUser().then(function (user) {
                    vm.sender_names = _.get(user.company.data, 'settings.messages.sms_sender_names', []);
                    vm.content.sender = vm.sender_names[0].value;
                });

                function send(content) {
                    $uibModalInstance.close(content);
                }

                function cancel() {
                    $uibModalInstance.dismiss('cancel');
                }
            },
            controllerAs: 'sms'
        });

        return modalInstance.result.then(function (content) {
            var message = {
                keys: contacts,
                type: 'sms',
                sender_name: content.sender_name,
                content: content.content
            };
            return Message.post(message);
        }, function (response) {
            return $q.reject(response);
        });
    };

    service.addCategory = function (contacts) {
        return SelectBox.multiple(Category, {
            addNew: false
        }).then(function (response) {
            return Restangular.one('categories/contacts').doPOST({keys: response.keys, contacts: contacts});
        }, function (response) { // handle cancel in select box
            return $q.reject(response);
        });
    };

    service.removeCategory = function (contacts, row, manager) {
        var model = Restangular.one('categories/contacts'),
            ResourceSelect = $injector.get('ResourceSelect');
        model.contacts = contacts;

        if (!_.isUndefined(row)) {
            model.keys = {items: [row.id]};
            return model.doDELETE().then(function (response) {
                if (!_.isUndefined(manager)) {
                    manager.refresh();
                }

                return response;
            });
        }

        return ResourceSelect.category().then(function (response) {
            model.keys = response.keys;
            return model.doDELETE();
        }, function (response) {
            return $q.reject(response);
        });
    };

    service.addPicklist = function (contacts) {
        var Picklist = $injector.get('Picklist');

        return SelectBox.get({
            model: Picklist,
            addNew: false
        }).then(function (picklist) {
            return Picklist.addContacts(picklist, contacts);
        }, function (response) { // Handle cancel event on select box
            return $q.reject(response);
        });
    };

    service.removePicklist = function (contacts, row, manager) {
        var model = Restangular.one('picklists/contacts'),
            ResourceSelect = $injector.get('ResourceSelect');
        model.contacts = contacts;

        if (!_.isUndefined(row)) {
            model.keys = {items: [row.id]};
            return model.doDELETE().then(function (response) {
                if (!_.isUndefined(manager)) {
                    manager.refresh();
                }

                return response;
            });
        }

        return ResourceSelect.picklist().then(function (response) {
            model.keys = response.keys;
            return model.doDELETE();
        }, function (response) { // Handle cancel event on select box
            return $q.reject(response);
        });
    };

    service.uploadImage = function (data) {
        return Upload.upload({
            url: Env.apiUrl.concat('/uploads/photo'),
            data: data
        }).then(function (response) {
            return response.data.image;
        }, function (response) {
            Error.default(response);
        });
    };

    service.download = function (url, name) {
        return $http
            .get(url, {
                responseType: 'blob',
                ignoreLoadingBar: true
            })
            .then(response => {
                return FileSaver.saveAs(new Blob([response.data], {type: response.headers('content-type')}), name);
            });
    }

    return service;
}
