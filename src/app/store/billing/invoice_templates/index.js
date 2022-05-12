import state from './state';
import Store from '../../base';


export default class InvoiceTemplates extends Store {
    constructor(model, ng){

        state.model = model;

        super({state, ng});
    }
}