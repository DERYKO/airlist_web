export default (rawContactData, company) => {
    const out = _.cloneDeep(rawContactData);

    delete out.changelog;

    if (!_.isUndefined(out.latestMessage)) {
        delete out.latestMessage;
    }

    if (!_.isUndefined(out.latestRsvp)) {
        delete out.latestRsvp;
    }

    if (!_.isUndefined(out.picklists)) {
        delete out.picklists;
    }

    const mediaFields = [
        'profile_image'
    ];

    const customFieldDefinitionRegex = new RegExp("custom_([0-9]{1,2})_name");
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
