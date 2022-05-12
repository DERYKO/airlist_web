/**
 * @ngdoc object
 * @name airlst.controller:ContactsDuplicatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .controller('ContactsDuplicateCtrl', [
        'Contact',
        'locale',
        '$state',
        '$stateParams',
        'SweetAlert',
        ContactsDuplicateCtrl
    ]);

function ContactsDuplicateCtrl(Contact, locale, $state, $stateParams, SweetAlert) {
    var vm = this;

    vm.selected = {};
    vm.selectValue = selectValue;
    vm.selectRecord = selectRecord;
    vm.notDuplicate = notDuplicate;
    vm.saveAndArchive = saveAndArchive;
    vm.diffValues = diffValues;

    init();

    function init() {
        Contact.getDuplicate($stateParams.id).then(function (response) {
            vm.model = response;
            vm.duplicates = response.duplicates.data;
            delete vm.model.duplicates;
            setupGrid();
        });

        Contact.getMergeableFields().then(function (response) {
            vm.fields = response;
        });

        vm.columns = [
            {field: 'label', name: ''},
            {field: 'final', name: 'Final'}
        ];
    }

    function setupGrid() {
        var data = [];
        _.forEach(vm.fields, function (field) {
            var row = {
                edited: false,
                field: field.slug,
                label: field.name,
                type: field.type,
                titleMap: field.titleMap,
                final: vm.model[field.slug]
            };
            _.forEach(vm.duplicates, function (record, index) {
                row['duplicate_' + index] = record[field.slug];
                if (_.isUndefined(vm.selected[field.slug]) && vm.model[field.slug] == record[field.slug]) {
                    vm.selected[field.slug] = 'duplicate_' + index;
                }
            });
            data.push(row);
        });

        for (var i = 0; i < vm.duplicates.length; i++) {
            vm.columns.push({
                field: 'duplicate_' + i,
                name: 'Contact ' + (i + 1)
            });
        }
        vm.data = data
    }

    function selectValue(row, col) {
        if (col.field == 'label') return;


        if (row[col.field] === 'true') {
            row[col.field] = true;
        } else if (row[col.field] === 'false') {
            row[col.field] = false;
        }

        if (col.field == 'final') {
            vm.model[row.field] = row['final'] = row[col.field];
            row['edited'] = true;
            vm.selected[row.field] = col.field;
        } else {
            vm.model[row.field] = row['final'] = row[col.field];
            row['edited'] = false;
            vm.selected[row.field] = col.field;
        }
    }

    function selectRecord(col) {
        if (col.field == 'final' || col.field == 'label') return;
        _.forEach(vm.data, function (row) {
            console.log(row, col);
            vm.selectValue(row, col);
        });
    }

    function notDuplicate(col) {
        console.log(col, vm.duplicates);
        var model = vm.duplicates[col.field.replace('duplicate_', '')];
        console.log(model);
        Contact.one(model.id).customPUT({duplicate: false}).then(function () {
            init();
        })
    }

    function saveAndArchive() {
        vm.model.unmerged_flag = false;
        return vm.model.save()
            .then(function (model) {
                model.one('merge')
                    .post()
                    .then(function () {
                        SweetAlert.swal(locale.getString('contacts.contact_saved'), locale.getString('contacts.contact_archive_successful'), 'success');
                        $state.go('app.contacts.duplicates');
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.saving_unsuccessful'), response.data.message, 'error');
                    });
            });
    }

    function diffValues(row) {
        const diff = _.filter(vm.columns, col => {
            if (col.field.contains('duplicate')) {
                console.log(row.label, col.field, row[col.field], row.final);
                return row[col.field] !== row.final;
            }
        });
        if (diff.length) console.log(row, diff);
        return diff.length;
    }
}