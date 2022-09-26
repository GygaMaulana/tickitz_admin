import axios from "axios";

const GetMoviesRequest = () => {
  return {
    type: "GET_MOVIES_REQUEST",
  };
};

const GetMoviesSuccess = (data) => {
  return {
    type: "GET_MOVIES_SUCCESS",
    payload: data,
  };
};

const GetMoviesError = (error) => {
  return {
    type: "GET_MOVIES_ERROR",
    payload: error,
  };
};

export const GetMovies = ({page=1, limit}) => {
  return (dispatch) => {
      dispatch(GetMoviesRequest())
      axios({
          method: "GET",
          url: `https://tickitz-debe.herokuapp.com/api/v1/movies${page ? `?page=${page}`:``}${limit ? `&limit=${limit}`:``}`,
        }) .then((res)=> { //ketika sukses, dispatch sucess
          dispatch(GetMoviesSuccess(res.data.data))
      }).catch((err)=> {
          dispatch(GetMoviesError(err))
      })
  }
};

// return (dispatch) => {
//     try {
//         const result = axios({
//             method: "GET",
//             url: "http://localhost:3006/api/v1/movies",
//             dispatch(GetMoviesSuccess(result.data))
//         })
//     } catch (error) {
//         dispatch(GetMoviesError(error.response))
//     }
// }