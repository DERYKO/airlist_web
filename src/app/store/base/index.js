import getters from './getters';
import helpers from './helpers';
import mutations from './mutations';
import state from './state';
import tasks from './actions';

class Store {

    constructor(resource) {
        this._state = _.defaultsDeep(resource.state, state);
        this._getters = _.defaultsDeep(resource.getters, getters);
        this.mutations = _.defaultsDeep(resource.mutations, mutations);
        this.helpers = _.defaultsDeep(resource.helpers, helpers);
        this.tasks = _.defaultsDeep(resource.tasks, tasks);
        this.ng = resource.ng;
        this.resetState();
        this.resetGetters();
        this.dispatch('loadState');
    }

    reset(state) {
        return new Store(_.defaultsDeep({state}, {
                state: this._state,
                getters: this._getters,
                mutations: this.mutations,
                helpers: this.helpers,
                tasks: this.tasks,
                ng: this.ng,
            })
        );
    }

    resetState() {
        this.state = _.cloneDeep(this._state);
        return this;
    }

    resetGetters() {
        const getters = {};
        const store = this;

        _.each(this._getters, function (func, name) {
            Object.defineProperty(getters, name, {
                get() {
                    return func(store.state, store)
                }
            })
        });

        this.getters = getters;
        return this;
    };

    commit(name, payload) {
        if (!this.mutations[name]) {
            throw Error('Mutation ' + name + ' has not been defined');
        }
        this.mutations[name](this.state, payload);
        return this;
    };

    dispatch(name, payload) {
        if (!this.tasks[name]) {
            throw Error('Task ' + name + ' has not been defined');
        }
        // console.log(name);
        return this.tasks[name].apply(this, [this, payload]);
    };

}

export default Store;
