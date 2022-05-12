
import state from './state';
import Store from '../../base';


export default class RsvpsDuplicates extends Store {
    constructor(name, model, ng){

        state.listview = name;
        state.model = model;

        super({state, ng});

        this._state.permanentFields = [];
        this._state.visible = [];
        this.resetState();
        this.dispatch('loadState');
    }
}
