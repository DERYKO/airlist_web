export default (store, success) => {
    const growl = store.ng.injector.get('growl');

    if(success) {
        growl.info('', {title: 'Copied'});
    } else {
        growl.error('', {title: 'Error on copy'});
    }
}
