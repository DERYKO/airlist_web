angular
    .module('airlst.components')
    .filter('random', [
        random
    ]);

function random() {
    return function (input, min, max) {

        min = parseInt(min);
        max = parseInt(max);

        return min + parseInt(Math.random() * (max - min));

    };
}