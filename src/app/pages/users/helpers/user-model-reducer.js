export default (rawUserData) => {
    const out = _.cloneDeep(rawUserData);

    const fieldsToDeleteIfExistent = [
        'created_at',
        'updated_at',
        'id',
        'company',
        'available_companies',
        'changelog',
    ];

    _.each(fieldsToDeleteIfExistent, (field) => {
        if (!_.isUndefined(out[field])) {
            delete out[field];
        }
    });

    const mediaFields = [
        'profile_image'
    ];

    _.each(mediaFields, (field) => {
        _.set(out, field, _.get(out, field + '.uuid', null));
    });

    return out;
}
