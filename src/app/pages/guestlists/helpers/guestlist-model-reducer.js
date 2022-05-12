export default (rawGuestlistData, company) => {
    const out = _.cloneDeep(rawGuestlistData);

    delete out.changelog;

    const mediaFields = [
        'image_1',
        'image_2',
        'image_3'
    ];

    out.date = new Date(out.date);

    const customFieldDefinitionRegex = new RegExp("custom_([0-9]{1,2})_guestlist");
    _.each(company, (value, field) => {
        if (!_.isEmpty(value) && field.match(customFieldDefinitionRegex)) {
            const customFieldNumber = _.get(customFieldDefinitionRegex.exec(field), '1');
            switch (_.get(value, 'type', value)) {
                case 'media_image':
                case 'media_file':
                    mediaFields.push('custom_' + customFieldNumber);
                    break;
            }
        }
    });

    _.each(mediaFields, (field) => {
        _.set(out, field, _.get(out, field + '.uuid', null));
    });

    return out;
}
