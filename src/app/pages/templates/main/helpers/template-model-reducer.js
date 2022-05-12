export default (rawData, company) => {
    const out = _.cloneDeep(rawData);

    delete out.changelog;

    const mediaFields = [
        'attachment_1',
        'attachment_2',
        'attachment_3',
    ];

    _.each(mediaFields, (field) => {
        _.set(out, field, _.get(out, field + '.uuid', null));
    });

    return out;
}
