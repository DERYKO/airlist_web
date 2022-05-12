/**
 * @ngdoc service
 * @name checkins.factory:changeStatusAndSendEmail
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('changeStatusAndSendEmail', [
        'Contact',
        'ResourceCommon',
        'SweetAlert',
        changeStatusAndSendEmail
    ]);

function changeStatusAndSendEmail(Contact, ResourceCommon, SweetAlert) {
    return {
        key: 'change-status-and-send-email',
        title: 'Accept Membership',
        level: 'selected',
        action: function (rows, manager) {
            var model = Contact.one();
            model.fields = {
                custom_4: 'angenommen', // Status Antrag
                custom_15: 'yes', // Welcome Mail versandt
                custom_21: moment().utc().format('DD.MM.YYYY') // Datum angenommen
            };
            model.items = [];
            rows.forEach(function (row) {
                model.items.push(row.id);
            });

            return model.customPUT().then(function () {
                model.type = 'Contact';

                return ResourceCommon.sendEmail(model).then(function () {
                    manager.refreshData().then(function (data) {
                        manager.buildView();
                        return data;
                    });
                    SweetAlert.success('Membership confirmed', rows.length + ' contacts have been accepted as members and were sent a welcome email.');
                })

            });
        }
    }
}