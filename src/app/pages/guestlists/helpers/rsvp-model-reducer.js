export default (rawRsvpData, guestlist) => {
    const out = _.cloneDeep(rawRsvpData);

    delete out.changelog;

    if (!_.isUndefined(out.contact)) {
        delete out.contact;
    }

    if (!_.isUndefined(out.last_message)) {
        delete out.last_message;
    }

    if (!_.isUndefined(out.guestlist)) {
        delete out.guestlist;
    }

    const customFieldDefinitionRegex = new RegExp("custom_([0-9]{1,2})_name");
    _.each(guestlist, (value, field) => {
        if (!_.isEmpty(value) && field.match(customFieldDefinitionRegex)) {
            const customFieldNumber = _.get(customFieldDefinitionRegex.exec(field), '1');
            switch (_.get(value, 'type', value)) {
                case 'media_image':
                case 'media_file':
                    _.set(out, 'custom_' + customFieldNumber , _.get(out, 'custom_' + customFieldNumber + '.uuid', null));
                    break;
            }
        }
    });

    return out;
}
