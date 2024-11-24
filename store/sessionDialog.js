// store/sessionDialog.js
export const state = () => ({
  isVisible: false
});

export const mutations = {
  showDialog(state) {
    state.isVisible = true;
  },
  hideDialog(state) {
    state.isVisible = false;
  }
};

export const actions = {
  show({ commit }) {
    commit('showDialog');
  },
  hide({ commit }) {
    commit('hideDialog');
  }
};
