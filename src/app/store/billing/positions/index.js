import state from './state';
import Store from '../../base';

export default class Positions extends Store {
    constructor(model, ng) {

        state.model = model;

        super({state, ng});
    }
}