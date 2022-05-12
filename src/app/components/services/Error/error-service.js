
/**
 * @ngdoc service
 * @name components.service:SelectBox
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .service('Error', [
        'locale',
        'SweetAlert',
        Error
    ]);

function Error(locale, SweetAlert) {
    var service = this;

    service.default = function (response) {
        if (response.data) {
            return SweetAlert.error('Oops! Something went wrong.', response.data.message);
        }
        return SweetAlert.error('Oops! Something went wrong.');
    };

    service.checkError = function (response) {
        if (!_.isUndefined(response.data)) {
            var errors = response.data.errors;

            var message;

            _.forEach(errors, function (ind, val) {
                if (!_.isUndefined(message))
                    message = message + ind + '\n';
                else
                    message = ind + '\n';
            });

            if (!message) {
                message = response.data.message;
            }

            return SweetAlert.error(locale.getString('sweetalerts.saving_unsuccessful'), message);
        }
        return SweetAlert.error('Oops! Something went wrong.');

    };

    return service;
}