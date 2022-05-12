export default (context, row) => {
    if (context.state.extendedListView) {
        if(context.state.currentExtendedRow === _.get(row, context.state.identifier_field)) {
            context.state.currentExtendedRow = null;
        } else {
            context.state.currentExtendedRow = _.get(row, context.state.identifier_field);
        }
    }
}
