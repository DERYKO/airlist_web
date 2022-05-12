
import state from './state';
import Store from '../../base/index';


export default class TemplateTypes extends Store {
    constructor(model, ng){

        state.model = model;

        super({state, ng});
    }
}