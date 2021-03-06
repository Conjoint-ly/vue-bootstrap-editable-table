import { db } from '~/db';
import { generateId } from "../helpers";

export const state = () => ({
  items: [],
});

export const mutations = {
  add(state, data) {
    state.items.push(data);
  },
  delete(state, query) {
    const itemIndex = state.items.findIndex(el => el.name === query.name);
    if (itemIndex > -1) {
      state.items.splice(itemIndex, 1);
    }
  },
  update(state, payload) {
    state.items = state.items.map(item => {
      if (item.name !== payload.rowName) return {...item};
      return {...item, [payload.fieldName]: payload.value};
    });
  },
  load(state, data) {
    state.items = [];

    for (let i = 0; i < data.length; i++) {
      state.items.push(data[i]);
    }
  },
  updateField(state, payload) {
    let items = state.items;
    if (Object.keys(payload.query).length) {
      items = state.item.filter(el => {
        let comparsion = false;
        for (const key in payload.query) {
          if (el.hasOwnProperty(key) && el[key] === payload.query[key]) {
            comparsion = true;
          }
        }

        return comparsion;
      });
    }

    items.forEach(el => {
      for (const key in payload.data) {
        this._vm.$set(el, key, payload.data[key]);
      }
    });
  },
  deleteField(state, payload) {
    state.items.forEach(item => {
      delete item[payload];
    });
  },
  move(state, { from, to }) {
    const field = state.items[from];
    state.items.splice(from, 1);
    state.items.splice(to, 0, field);
  },
  bulkUpdate(state, records) {
    records.forEach(record => {
      if (record.name) {
        const item = state.items.find(el => el.name === record.name);
        Object.entries(record).forEach(([key, value]) => item[key] = value);
      } else {
        state.items.push({ ...record, name: generateId() });
      }
    });
  }
};

export const getters = {
  items(state) {
    return state.items;
  },
};

export const actions = {
  async create({ commit }) {
    let payload = { name: generateId() };

    const response = await db.post({
      table: 'datas-table',
      query: {},
      payload
    });

    if (response.status === 'Ok') {
      commit('add', payload);
    }

    return response.status;
  },
  async read({ commit, rootGetters }) {
    const response = await db.get({ table: 'datas-table', query: {} });
    const aggregationFields = rootGetters['fieldTable/aggregationFields'];

    commit('load', response.data);

    return response.status;
  },
  async update({ commit, rootGetters }, payload) {
    const data = {};
    data[payload.fieldName] = payload.value;

    const response = await db.put({
      table: 'datas-table',
      query: { name: payload.rowName },
      payload: data
    });

    if (response.status === 'Ok') {
      commit('update', payload);
    }

    return response.status;
  },
  async delete({ commit, rootGetters }, payload) {
    const response = await db.delete({ table: 'datas-table', query: payload });

    if (response.status === 'Ok') {
      commit('delete', payload);
    }

    return response.status;
  },
  async deleteField({ commit }, payload) {
    const response = await db.deleteColumn({
      table: 'datas-table',
      query: payload.query.name
    });

    if (response.status === 'Ok') {
      commit('deleteField', payload.query.name);
    }
  },
  async move({ dispatch, commit }, { from, to }) {
    const response = await db.put({
      table: 'datas-table',
      query: { index: from },
      payload: { index: to },
    });

    if (response.status === 'Ok') {
      commit('move', { from, to });
    }
  },
  async bulkUpdate({ dispatch, commit }, records) {
    const response = await db.multiUpdate({
      table: 'datas-table',
      payload: { records },
    });

    if (response.status === 'Ok') {
      commit('bulkUpdate', records);
    }
  },
};
