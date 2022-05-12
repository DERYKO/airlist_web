import templateUrl from './scroll-toolset.tpl.html';


class ToolsetCtrl {
    constructor($state) {
        this.state = $state;
    }

    $onInit() {
        if (this.store) {
            this.current = this.store.state.data[this.index]
        }
    }

    showScrollButtons() {
        return !!this.store;
    }

    showPrevious() {
        return this.showScrollButtons() && this.index > 0;
    }

    showNext() {
        return this.showScrollButtons() && this.index < this.store.state.data.length - 1;
    }

    previous() {
        const model = this.store.state.data[this.index - 1];
        if (model && this.onScrollUp) {
            return this.onScrollUp({model});
        }
    }

    next() {
        const model = this.store.state.data[this.index + 1];
        if (model && this.onScrollDown) {
            return this.onScrollDown({model});
        }
    }

}


angular
    .module('airlst.components')
    .component('scrollToolset', {
        bindings: {
            model: '=',
            store: '=',
            index: '=',
            actions: '=',
            onScrollUp: '&',
            onScrollDown: '&',
        },
        controller: ['$state', ToolsetCtrl],
        controllerAs: 'vm',
        templateUrl: templateUrl
    });