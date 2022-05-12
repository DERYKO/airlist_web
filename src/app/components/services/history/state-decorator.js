

/**
 * @ngdoc decorator
 * @name auth.decorator:auth
 * @restrict EA
 * @element
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .config([
        '$provide',
        decorator
    ]);

function decorator($provide) {
    $provide.decorator('$state', [
        '$delegate',
        '$rootScope',
        function ($delegate, $rootScope) {

            $delegate.history = [];

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                console.log(toState);
                if (!fromState.abstract && (_.isUndefined(fromState.data.track) || fromState.data.track)) {
                    if ($delegate.history.length > 0) {
                        var previous = $delegate.previous();
                        if (previous.state.name === fromState.name && previous.params === fromParams) {
                            return;
                        }
                    }

                    $delegate.history.push({
                        state: fromState,
                        params: fromParams
                    });

                    if ($delegate.history.length > 120) {
                        $delegate.history = _.slice($delegate.history, 0, 120);
                        console.log($delegate.history)
                    }

                }
            });


            $delegate.back = function (skip) {
                var previous = $delegate.previous(skip);
                if (!previous) {
                    return false;
                }
                $delegate.go(previous.state.name, previous.params);
                return true;
            };

            $delegate.previous = function (skip) {
                if ($delegate.history.length === 0) {
                    return false;
                }
                if (skip) {
                    skip = $delegate.history.length - skip;
                    if (skip >= 0) {
                        return $delegate.history[skip];
                    }
                    return false
                }
                return _.last($delegate.history);

            };

            return $delegate;
        }
    ]);
}
