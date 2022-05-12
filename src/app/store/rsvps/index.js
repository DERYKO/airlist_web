
import state from './state';
import Store from '../base';


export default class Rsvps extends Store {
    constructor(name, model, ng){

        state.listview = name;
        state.model = model;

        super({state, ng});
    }
}