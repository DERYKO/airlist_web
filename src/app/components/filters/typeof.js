angular
    .module('airlst.components')
    .filter('typeof', typeOfFilter);

function typeOfFilter() {
    return function (obj) {
        return typeof obj
    };
}
