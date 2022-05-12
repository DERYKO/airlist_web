
import state from './state';
import Store from '../base';
import * as mutations from './mutations';


export default class Contacts extends Store {
    constructor(model, ng){

        state.model = model;
        super({state, mutations, ng});
    }
}