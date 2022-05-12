/**
 * @ngdoc filter
 * @name toolbox.filter:humanize
 *
 * @description
 *
 * @param {Array} input The array to filter
 * @returns {Array} The filtered array
 *
 */
angular
    .module('airlst.toolbox')
    .filter('humanize', humanize);

function humanize() {
    return function (input) {
        var human;
        human = input.replace('_', ' ');
        _.capitalize(human);
        return human;
    };
}