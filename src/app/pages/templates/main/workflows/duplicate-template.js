import templateModelReducer from '../helpers/template-model-reducer';

class duplicateTemplate {
    constructor($state) {
        this.key = 'duplicate-template';
        this.title = 'Duplicate';
        this.level = 'highlight';
        this.icon = 'fal fa-copy';
        this.order = 30;
        this.state = $state;
    }

    action(template, vm) {
        const newInstance = templateModelReducer(template);
        newInstance.name = newInstance.name + ' - copy';
        this.state.go('app.templates.main.create', {template: newInstance});
    }

}

angular
    .module('airlst.templates.main')
    .factory('duplicateTemplate', [
        '$state',
        ($state) => new duplicateTemplate($state)
    ]);

