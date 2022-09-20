const initialState = {
  loading: false,
  data: {
    totalRow: 0,
    totalPage: 0,
    results: [],
  },
};

const Movies = (state = initialState, action = {}) => {
  switch (action.type) {
    case "GET_MOVIES_REQUEST":
      return { ...state, loading: true };
    case "GET_MOVIES_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "GET_MOVIES_SUCCESS":
      return { ...state, loading: false, data: action.payload };

    default:
      return state
  }
};

export default Movies