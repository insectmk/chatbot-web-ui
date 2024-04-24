import Vue from 'vue'
import Vuex from 'vuex'
import {getModelVersionAll} from '@/api'

Vue.use(Vuex)


// 用来存储数据
const state = {
    // 模型数据
    models: []
}
// 响应组件中的事件
const actions = {
    // 获取所有的模型
    getModelVersionAll({ commit }) {
        getModelVersionAll().then(res => {
            commit('setModels', res.data.data);
        })
    },
}
// 操作数据
const mutations = {
    setModels(state, data) {
        state.models = data
    },
}
// 用来将state数据进行加工
const getters = {

}
// 新建并暴露store
export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters
})
