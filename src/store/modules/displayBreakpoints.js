const breakPointMappings = {
  xs: 599,
  sm: 959,
  md: 1263,
  lg: 1904,
  xl: 2 ** 31 - 1
};

function displaySizeToBreakpoint (size = 0) {
  const filteredEntries = Object.entries(breakPointMappings)
    .filter(([type, breakpoint]) => size <= breakpoint)
    .map(([type, breakpoint]) => type);
  return filteredEntries[0] || 'xl';
}

function breakpointToDisplaySize (type) {
  return breakPointMappings[type];
}

const displayStore = {
  namespaced: true,
  state: {
    type: ''
  },
  mutations: {
    updateType (state, newWidth) {
      const oldType = state.type;
      state.type = displaySizeToBreakpoint(newWidth);
      if (oldType !== state.type) {
        console.debug('updated display type to', state.type);
      }
    }
  },
  getters: {
    breakpointToDisplaySize: state => breakpointToDisplaySize
  }
};

export default displayStore;
