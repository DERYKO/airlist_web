angular
    .module('airlst.components')
    .filter('range', [
        range
    ]);

function range() {
    return function (input, min, max) {
        min = parseInt(min);
        max = parseInt(max);

        for (min; min <= max; min++) {
            input.push(min);
        }
        return input;
    };
}