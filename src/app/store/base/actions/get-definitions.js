export default (store) => {

    const $http = store.ng.injector.get('$http');
    const slug = store.state.definitionsUrl || store.getters.slug;
    const growl = store.ng.injector.get('growl');

    return $http.get('fp/' + slug + '/definition')
        .then(response => {
            store.dispatch('loadColumns', response.data);
            return this;
        }, (e) => {
            growl.error('Error while loading definitions', {'title': 'Error'})
        }).catch((e) => {
            growl.error('Error while loading definitions', {'title': 'Error'})
        });
}
