/**
 * @ngdoc object
 * @name theme.base.controller:AlTopSearchCtrl
 *
 * @description
 *
 */

class AlTopSearchCtrl {
    constructor(Contacts, $element, $scope, $state, Acl) {
        this.store = Contacts.reset({
            persist: false,
            listview: 'AlTopSearchListView',
            visible: [
                'full_name',
                'profile_image',
                'id',
                'code',
                'company_name'
            ],
            columns: [
                {
                    key: 'full_name',
                    type: 'string',
                    visible: true
                },
                {
                    key: 'profile_image',
                    type: 'string',
                    visible: true
                },
                {
                    key: 'id',
                    type: 'integer',
                    visible: true
                },
                {
                    key: 'code',
                    type: 'string',
                    visible: true
                },
                {
                    key: 'company_name',
                    type: 'string',
                    visible: true
                }
            ]
        });
        this.store.commit('setPagination', {perPage: 8});

        this.element = $element;
        this.scope = $scope;
        this.state = $state;
        this.acl = Acl;

        this.dropdownShown = false;
        this.loading = true;
        this.timer = 0;
        this.searchValue = '';
        this.results = [];
        this.initWatchers();
    }

    initWatchers() {
        this.scope.$watch(() => {
            return this.searchValue;
        }, () => {
            this.doSearch();
        })
    }

    doSearch() {
        if (!this.dropdownShown) {
            this.startSearch();
        }
        if (this.searchValue === '') {
            clearTimeout(this.timer);
            this.quitSearch();
        } else {
            this.loading = true;
            this.delayedSearch(() => {
                this.refreshResults();
            }, 400);
        }
    }

    refreshResults() {
        this.results = [];
        this.store.commit('setKeyword', this.searchValue);
        this.store.dispatch('getData').then(() => {
            this.results = this.store.state.data;
            this.loading = false;
        });
    }

    startSearch() {
        this.timer = 0;
        this.dropdownShown = true;
    }

    quitSearch() {
        this.searchValue = '';
        this.dropdownShown = false;
        this.applyAsync();
    }

    delayedSearch(callback, ms) {
        clearTimeout(this.timer);
        this.timer = setTimeout(callback, ms);
    }

    goToContact(contact) {
        this.quitSearch();
        this.state.go('app.contacts.details', {id: contact.id});
    }

    applyAsync() {
        this.scope.$evalAsync();
    }
}

AlTopSearchCtrl.$inject = [
    'Contacts',
    '$element',
    '$scope',
    '$state',
    'Acl'
];

angular
    .module('airlst.theme.airlst')
    .controller('AlTopSearchCtrl',
        AlTopSearchCtrl
    );

