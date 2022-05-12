
import state from './state';
import Store from '../../base/index';


export default class DocumentTemplates extends Store {
    constructor(model, ng){

        state.model = model;

        super({state, ng});
    }
}