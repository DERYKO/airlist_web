/**
 * @ngdoc service
 * @name components.service:SelectBox
 *
 * @descripton
 *
 */
angular
    .module('airlst.components')
    .factory('pusherFactory', [
        'Env',
        '$pusher',
        pusherFactory
    ]);

function pusherFactory(Env, $pusher) {
    if (!window.Pusher) {
        return {
            subscribe: function () {
                return {
                    bind: function () {
                    }
                }
            },
        };
    }
    return $pusher(new Pusher(Env.puher.key, {
        cluster: Env.pusher.cluster,
        encrypted: Env.pusher.encrypted
    }));
}