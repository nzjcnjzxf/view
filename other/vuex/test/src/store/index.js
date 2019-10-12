import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = { // 要设置的全局访问的state对象
  showFooter: true,
  changableNum: 0
  // 要设置的初始属性值
}
const getters = {
  foot: state => state.showFooter
}
const mutations = {
  add (state) {
    state.changableNum++
  },
  setNum (state, val) {
    state.changableNum = val
  }
}
const actions = {
  testAction (context, item) {
    context.commit('add')
  },
  action (context, item) {
    setTimeout(() => {
      context.commit('setNum', item)
      console.log(state.changableNum)
    }, 2000)
  }
}
const modules = {
  test: {
    namespaced: true,
    state: {
      a: 1,
      b: 9
    },
    getters: {},
    mutations: {
      fa (state, a) {
        state.a = a
      }
    },
    actions: {}
  }
}
const store = new Vuex.Store({
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules
})

export default store
