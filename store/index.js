// store/index.js
export const state = () => ({
    authenticated: false,
    user: null
})

export const mutations = {
    setAuthenticated(state, value) {
        state.authenticated = value
    },
    setUser(state, user) {
        state.user = user
    }
}

export const actions = {
    login({ commit }, user) {
        // Aquí iría tu lógica de autenticación
        commit('setAuthenticated', true)
        commit('setUser', user)
    },
    logout({ commit }) {
        commit('setAuthenticated', false)
        commit('setUser', null)
    }
}
