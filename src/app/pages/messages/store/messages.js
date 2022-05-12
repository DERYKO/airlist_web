import Messages from '../../../store/messages';

angular
    .module('airlst.messages')
    .factory('Messages', [
        '$injector',
        'Message',
        ($injector, Message) => new Messages(Message, {
            injector: $injector
        })
    ]);
