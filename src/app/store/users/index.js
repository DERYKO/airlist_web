import tasks from './actions';
import mutations from './mutations';
import state from './state';
import Store from '../base';


export default class Users extends Store {
  constructor(model, ng) {
    state.model = model;
    super({state, mutations, tasks, ng});
  }
}