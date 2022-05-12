const formatters = {
    date(val) {
        return moment(val).format('D.M.Y')
    },
    datetime(val) {
        return moment(val).format('D.M.Y HH:mm')
    },
    datetimeexact(val) {
        return moment(val).format('D.M.Y HH:mm:ss')
    },
    color_code_select(val, store) {
        if (_.isObject(val)) {
            const out = `<span class="color-badge" style="background: ${val.color_code};"></span>&nbsp;${val.label}`;
            return store.ng.injector.get('$sce').trustAsHtml(out);
        } else {
            return '';
        }
    },
    image(val, store) {
        if (_.isObject(val)) {
            const out = `<img class="grid-image" src="${val.thumbnail}" alt="${val.name}" title="${val.name}"/>`;
            return store.ng.injector.get('$sce').trustAsHtml(out);
        } else {
            return '';
        }
    }
};

export default {
    getCell(row, col, store, stripHtml) {
        if (!col) {
            return '';
        }
        let out = '';
        if (col.template && _.isFunction(col.template)) {
            out = col.template(row, col, store);
        } else if (formatters[col.type]) {
            out = formatters[col.type](_.get(row, col.key), store);
        } else if (col.type === 'string' && col.filter_information && col.filter_information.type === 'enum') {
            const value = _.get(col.filter_information, 'data.' + _.get(row, col.key), '');
            if (value !== '') {
                out = value;
            } else {
                out = _.get(row, col.key);
            }
        } else {
            out = _.get(row, col.key);
        }

        if (_.isString(out)) {
            if (stripHtml) {
                out = out.replace(new RegExp('(<([^>]+)>)', 'ig'), '');
            }

            out = out.trim();
        }

        return out;
    },
    isEqual(expected, actual) {
        return _.isEqual(expected, actual)
    }
}
