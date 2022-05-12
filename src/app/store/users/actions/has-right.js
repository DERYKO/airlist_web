export default ({state}, payload) => {
    if(!payload.module || !payload.right) {
        console.error('Invalid hasRight payload', {
            payload: payload
        })
    }
    const moduleRights = _.get(state.loggedin.profile.rights, payload.module, false);
    if(!moduleRights) {
        return false;
    }

    return moduleRights.indexOf(payload.right) !== -1;
};
