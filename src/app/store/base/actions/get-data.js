// function initiatePusher(Env, scope) {
//    const pusher = new Pusher(Env.pusher.key, {
//        cluster: Env.pusher.cluster,
//        encrypted: Env.pusher.encrypted
//    });
//
//    pusher.subscribe('user-id-' + scope.user.id);
//
//    return pusher;
// }

export default (store) => {
    const $http = store.ng.injector.get('$http');
    const slug = store.state.dataUrl || store.getters.slug;
    const Env = store.ng.injector.get('Env');
    const growl = store.ng.injector.get('growl');
    store.commit('setBusy', true);

    // // TODO AC-293 reuse pusher from inital loggedin store.
    // if (!store.state.pusher) {
    //    store.commit('setPusher', initiatePusher(Env, angular.element(document.body).scope().$root));
    //
    //    // get data just on job done
    //    store.state.pusher.bind('background-jobs', function (data) {
    //        console.log('fff');
    //        if (data.log.job_name.indexOf(store.state.pusherEvents)) {
    //            return getData();
    //        }
    //    });
    // }

    // get data
    return getData();

    function getData() {
        return $http.post('fp/' + slug, {
            onlyArchived: store.state.archived,
            keyword: store.state.keyword,
            fields: store.getters.fields,
            filters: store.getters.filters,
            sort: store.state.sort,
            pagination: store.state.pagination
        }).then((response) => {
            store.commit('setData', response.data.data);
            if(!_.isUndefined(response.data.stats)) {
                store.commit('setStats', response.data.stats);
            } else {
                store.commit('setStats', {});
            }
            store.commit('setPagination', response.data.pagination);
            store.commit('setSelectAllWithReselect', store.state.selection.selectAll);
            store.commit('setBusy', false);
        },(e) => {
            growl.error('Error while loading data', {'title': 'Error'})
        }).catch((e) => {
            growl.error('Error while loading data', {'title': 'Error'})
        });
    }
}
