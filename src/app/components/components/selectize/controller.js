

class ComponentsSelectizeCtrl {
    constructor($element, $scope) {
        this.element = $element;
        this.scope = $scope;
    }

    $onInit() {
        this.maxItems = this.maxItems || 1;
        if (this.ngModel === undefined) {
            this.ngModel = this.maxItems > 1 ? [] : '';
        }

        const options = _.defaults(this.selectizeOptions, {
            maxItems: this.maxItems || 1,
            options: this.items || [],
            delimiter: '##--..--##',
            placeholder: (this.maxItems > 1) ? 'Select one or more' : 'Select one',
            valueField: 'value',
            labelField: 'label',
            searchField: 'label',
            sortField: 'label'
        });

        this.selectizeInstance = this.element.find('select').selectize(options)[0].selectize;

        this.selectizeInstance.setValue(this.ngModel);

        setTimeout(() => {
            this.scope.$watch(() => this.items, (items, old) => {
                if (!_.isEqual(items, old)) {
                    this.selectizeInstance.clearOptions();
                    this.selectizeInstance.addOption(items);
                    this.selectizeInstance.setValue(this.ngModel);
                }
            });

            // TODO check if still required, the value is already set...
            // causes $digest error on two way binging
            //this.scope.$watch(() => this.ngModel, newValue => {
            //    if (!_.isEqual(newValue, this.selectizeInstance.getValue())) {
            //        this.selectizeInstance.setValue(newValue);
            //    }
            //});

            this.scope.$watch(() => this.ngDisable, disable => {
                if (disable) {
                    return this.selectizeInstance.disable()
                }
                return this.selectizeInstance.enable()
            });

            this.selectizeInstance.on('change', (val) => {
                if (!_.isEqual(this.ngModel, val)) {
                    this.ngModel = val;
                    this.onChange({model: val});
                    this.scope.$evalAsync();
                }
            });

        }, 1000)


    }
}

angular
    .module('airlst.components')
    .controller('ComponentsSelectizeController', [
        '$element',
        '$scope',
        ComponentsSelectizeCtrl
    ]);
