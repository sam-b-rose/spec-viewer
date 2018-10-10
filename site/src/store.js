import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    specs: []
  },
  mutations: {
    FETCH_SPECS_PENDING() {
      // eslint-disable-next-line
      console.log('Fetching specs 🚀')
    },
    FETCH_SPECS_COMPLETE(state, payload) {
      state.specs = payload
      // eslint-disable-next-line
      console.log('Fetching specs complete ✨')
    },
    FETCH_SPECS_FAILED(state, error) {
      // eslint-disable-next-line
      console.log('Fetching specs failed 🙅', error)
      if (process.env.NODE_ENV !== 'production')
        import('../dist/specs.json').then(
          specs => (state.specs = specs.default)
        )
    }
  },
  actions: {
    async fetchSpecs({ commit }) {
      try {
        commit('FETCH_SPECS_PENDING')
        let { data } = await axios.get('./specs.json')
        commit('FETCH_SPECS_COMPLETE', data)
      } catch (error) {
        commit('FETCH_SPECS_FAILED', error)
      }
    }
  }
})
