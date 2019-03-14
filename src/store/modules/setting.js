export default {
  namespaced: true,
  state: {
    isMobile: false,
    theme: 'dark',
    layout: 'side',
    systemName: '桔集',
    multipage: true
  },
  mutations: {
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setTheme (state, theme) {
      state.theme = theme
    },
    setLayout (state, layout) {
      state.layout = layout
    },
    setMultipage (state, multipage) {
      state.multipage = multipage
    }
  }
}
