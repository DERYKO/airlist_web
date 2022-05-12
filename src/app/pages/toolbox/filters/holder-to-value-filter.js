/**
 * @ngdoc filter
 * @name toolbox.filter:holderToValue
 *
 * @description
 *
 * @param {Array} input The array to filter
 * @returns {Array} The filtered array
 *
 */
angular
    .module('airlst.toolbox')
    .filter('holderToValue', holderToValue);

function holderToValue() {
    return function (input, options) {
        if (_.startsWith(input, '{{')) {
            input = input.replace('{{', '').replace('}}', '').replace(' ', '_');
            return 'the value of '.concat(options[input.toLowerCase()]);
        }
        return input;
    };
}
