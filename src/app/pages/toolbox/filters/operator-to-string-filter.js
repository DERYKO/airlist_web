/**
 * @ngdoc filter
 * @name toolbox.filter:operatorToString
 *
 * @description
 *
 * @param {Array} input The array to filter
 * @returns {Array} The filtered array
 *
 */
angular
    .module('airlst.toolbox')
    .filter('operatorToString', [
        'locale',
        operatorToString
    ]);

function operatorToString(locale) {
    return function (input) {
        var string = '';

        switch (input) {
            case '=':
                string = locale.getString('common.is_equal_to');
                break;
            case '<>':
                string = locale.getString('common.is_not_equal_to');
                break;
            case '>':
                string = locale.getString('common.is_greater_than');
                break;
            case '>=':
                string = locale.getString('common.is_greater_than_or_equal_to');
                break;
            case '<':
                string = locale.getString('common.is_less_than');
                break;
            case '<=':
                string = locale.getString('common.is_less_than_or_equal_to');
                break;
        }

        return string;
    };
}