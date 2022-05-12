export default () => {
    return (input) => {
        let currentValue = parseInt(input),
            unitIndex = 0;
        const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        do {
            if (currentValue > 1000) {
                currentValue = currentValue / 1000;
            } else {
                return currentValue.toFixed(2) + ' ' + units[unitIndex];
            }
        } while (currentValue > 1000);

        return currentValue.toFixed(2) + ' ' + units[unitIndex];
    }
}

angular.module('myReverseFilterApp', [])
    .filter('reverse', function () {
        return function (input, uppercase) {
            input = input || '';
            var out = '';
            for (var i = 0; i < input.length; i++) {
                out = input.charAt(i) + out;
            }
            // conditional based on optional argument
            if (uppercase) {
                out = out.toUpperCase();
            }
            return out;
        };
    });
