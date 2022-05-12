export default (rawData) => {
    const out = _.cloneDeep(rawData),
        fieldsToDeleteIfExistent = [
            'created_at',
            'updated_at'
        ],
        mediaFields = [
            'background_image'
        ];

    _.each(fieldsToDeleteIfExistent, (field) => {
        if (!_.isUndefined(out[field])) {
            delete out[field];
        }
    });

    _.each(mediaFields, (field) => {
        _.set(out, field, _.get(out, field + '.uuid', null));
    });

    return out;
}
