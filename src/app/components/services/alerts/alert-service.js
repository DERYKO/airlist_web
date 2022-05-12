class Alert {

    constructor(SweetAlert, $q, growl) {
        this.sweetAlert = SweetAlert;
        this.promise = $q;
        this.show = growl;
    }

    success(title, message) {
        return this.show.success(message, {title});
    }

    info(title, message) {
        return this.show.info(message, {title});
    }

    warning(title, message) {
        return this.show.warning(message, {title});
    }

    error(title, message, useContentAsHtml) {
        return this.sweetAlert.swal({
            title: title,
            text: message,
            html: !!useContentAsHtml,
            type: 'error'
        });
    }

    confirm(options) {
        return new Promise((resolve, reject) => {
            this.sweetAlert.swal({
                title: options.title,
                text: options.message,
                type: options.type,
                showCancelButton: true,
                confirmButtonColor: options.confirmBtnColor || '#ed5565',
                confirmButtonText: options.confirmBtn,
                showLoaderOnConfirm: options.wait,
                closeOnConfirm: !options.wait
            }, function (isConfirm) {
                isConfirm ? resolve() : reject();
            });
        });
    }

    handle(response) {
        const ignore = [
            'backdrop click',
            'escape key press',
            'cancel',
        ];


        if (response && _.get(response, 'data.status') === 422) {
            let errorString = '';
            errorString += '<ul>';
            _.each(_.get(response, 'data.validation_errors'), (errors, fieldKey) => {
                _.each(errors, (curError) => {
                    errorString += '<li>' + curError + '</li>';
                });
            });
            errorString += '</ul>';

            this.error('Invalid Data', errorString, true);
        } else if (response && _.get(response, 'data.status_code') === 422) {
            let errorString = '';
            errorString += '<ul>';
            _.each(_.get(response, 'data.errors'), (errors, fieldKey) => {
                _.each(errors, (curError) => {
                    errorString += '<li>' + curError + '</li>';
                });
            });
            errorString += '</ul>';

            this.error('Invalid Data', errorString, true);
        } else if (response && ignore.indexOf(response) === -1) {
            if (response.data) {
                return this.error('Oops something went wrong!', response.data.message);
            }
            if (response.message) {
                return this.error('Oops something went wrong!', response.message);
            }
            this.error('Oops something went wrong!', response);
        }
    }

}


angular
    .module('airlst.components')
    .service('Alert', ['SweetAlert', '$q', 'growl', (SweetAlert, $q, growl) => new Alert(SweetAlert, $q, growl)]);
