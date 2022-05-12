angular
    .module('airlst.components')
    .filter('objLength', [
        objLength
    ]);

function objLength() {
    return function (input) {
        return Object.keys(input).length;
    };
}