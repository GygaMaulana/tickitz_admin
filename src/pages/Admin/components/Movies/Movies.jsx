import React, { useEffect, useState } from "react";
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "./styles.scss";
import axios from "axios";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetMovies } from "../../../../redux/actions/Movies";

const Movies = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useSearchParams();
  const [params, setParams] = useState({
    page: query.get("page") ?? 1,
    search: query.get('search') ?? '',
    limit: 5,
  });

  // const searchHandler = async (e) => {
  //   e.preventDefault()
  //   const search = e.target.value
  //   setParams((prevState) => ({
  //     ...prevState,
  //     search: search,
  //   }))
  //   query.set('search', search)
  //   setQuery(query)
  // }

  const auth = useSelector((state) => state.auth);
  const [ refetch, setRefetch ] = useState(false)
  const [movieSchedule, setMovieSchedule] = useState({
    loading: false,
    results: {
      data: [],
    },
  });

  const [formEditData, setFormEditData] = useState({});
  const [formAddData, setFormAddData] = useState({});
  const formData = new FormData();
  formData.append("title", formEditData.title || formAddData.title);
  formData.append("genre", formEditData.genre || formAddData.genre);
  formData.append(
    "durationHours",
    formEditData.durationHours || formAddData.durationHours
  );
  formData.append(
    "durationMinute",
    formEditData.durationMinute || formAddData.durationMinute
  );
  formData.append("rating", formEditData.rating || formAddData.rating);
  formData.append("director", formEditData.director || formAddData.director);
  formData.append("writer", formEditData.writer || formAddData.writer);
  formData.append(
    "releaseDate",
    formEditData.releaseDate || formAddData.releaseDate
  );
  formData.append("cast", formEditData.cast || formAddData.cast);
  formData.append(
    "description",
    formEditData.description || formAddData.description
  );
  formData.append("cover", formEditData.cover || formAddData.cover);


  useEffect(() => {
    setMovieSchedule((prevState) => ({
      ...prevState,
      loading: true,
    }));
    axios({
      method: "GET",
      url: `http://localhost:3006/api/v1/movies`,
    })
      .then((res) => {
        setMovieSchedule({
          loading: false,
          results: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [movieSchedule]);

  useEffect(() => {
    dispatch(GetMovies(params));
  }, [refetch, params]);
  const { data, error, loading } = useSelector((state) => state.movies);
  let totalPage = Array(data.totalPage).fill() ?? [];
  const handlePaginate = (page) => {
    setParams((prevState) => ({ ...prevState, page }));
    query.set("page", page);
    setQuery(query);
  };

  //add
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      console.log(formData.get("title"));
      console.log(formData.get("genre"));
      console.log(formData.get("releaseDate"));
      const result = await axios({
        method: "POST",
        data: formData,
        url: "http://localhost:3006/api/v1/movies",
        headers: {
          Authorization: auth.data.token,
        },
      });
      if (result) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Successfully added',
          showConfirmButton: false,
          timer: 1500
        })
        setRefetch(!refetch);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  //delete
  const handleDelete = (movieID) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "",
        icon: "",
        showCancelButton: true,
        confirmButtonText: "YES, DELETE IT",
        cancelButtonText: "NO, CANCEL",
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios({
            method: "DELETE",
            url: `http://localhost:3006/api/v1/movies/${movieID}`,
          });
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your data has been deleted.",
            "success"
          );
          setRefetch(!refetch);
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  //edit
  const handleEdit = (prevData) => {
    setFormEditData({
      ...prevData,
      releaseDate: moment(prevData.releaseDate).format("DD-MM-YYYY"),
    });
  };
  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      const result = await axios({
        method: "PATCH",
        data: formData,
        url: `http://localhost:3006/api/v1/movies/${formEditData.movieID}`,
        headers: {
          Authorization: auth.data.token,
        },
      });
      if (result) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Successfully updated',
          showConfirmButton: false,
          timer: 1500
        })
        setRefetch(!refetch);
      } else {
        alert("Failed, Try Again");
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };

  const Loading = () => {
    <div>Loading...</div>;
  };
  return (
    <div className="movies">
      <hr />
      {/* <div className="top">
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => searchHandler(e)}
          />
          <SearchOutlinedIcon className="icon" />
        </div>
        <select class="select">
          <option selected className="option">
            Order By
          </option>
          <option value="asc" className="option">
            ASC
          </option>
          <option value="desc" className="option">
            DESC
          </option>
        </select>
      </div> */}
      <div className="center">
        <button
          className="add-new"
          data-bs-toggle="modal"
          data-bs-target="#addNewMovie"
        >
          Add new movie
        </button>
        <table className="table table-striped caption-top">
          <caption></caption>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Director</th>
              <th>Writer</th>
              <th>Rating</th>
              <th>Release Date</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!data?.results?.length ? (
              <Loading />
            ) : (
              data?.results?.map((movie, index) => {
                return (
                  <tr key={index}>
                    <td>{movie.title}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.director}</td>
                    <td>{movie.writer}</td>
                    <td>{movie.rating}</td>
                    <td>{moment(movie.releaseDate).format('DD MMM YYYY')}</td>
                    <td>{movie.durationHours} hour {movie.durationMinute} minute</td>
                    <td className="icon-button">
                      <button
                        onClick={() => handleEdit(movie)}
                        data-bs-toggle="modal"
                        data-bs-target="#editMovie"
                      >
                        {/* <EditIcon className="icon" /> */}
                        <div className="icon">Edit</div>
                      </button>
                      <button onClick={() => handleDelete(movie.movieID)}>
                        {/* <DeleteOutlineIcon className="icon" /> */}
                        <div className="icon">Delete</div>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div aria-label="Page navigation">
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {totalPage.map((item, index) => {
              // let page = parseInt(paginate.page)
              return (
                <li className={`page-item`}>
                  <button
                    className="page-link"
                    onClick={() => handlePaginate(index + 1)}
                  >
                    <span aria-hidden="true">{index + 1}</span>
                  </button>
                </li>
              );
            })}
            <li className="page-item">
              <a className="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ADD MOVIES */}
      <div
        className="modal fade"
        id="addNewMovie"
        tabIndex="-1"
        aria-labelledby="addNewMovieLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewMovieLabel">
                Add new movie
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={(e) => handleAddMovie(e)}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        title: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        genre: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="d-flex justify-content-between">
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Duration Hours
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        durationHours: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Duration Minute
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        durationMinute: e.target.value,
                      }));
                    }}
                  />
                </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Rating
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        rating: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Director
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        director: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Writer
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        writer: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Release Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        releaseDate: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Cast
                  </label>
                  <input
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        cast: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        description: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div class="mb-3">
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        cover: e.target.files[0],
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => handleAddMovie(e)}
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* EDIT MOVIES */}
      <div
        className="modal fade"
        id="editMovie"
        tabIndex="-1"
        aria-labelledby="editMovieLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editMovieLabel">
                Edit Movies
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={(e) => handleUpdateMovie(e)}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    value={formEditData.title}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        title: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Genre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.genre}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        genre: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Duration Hours
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.durationHours}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        durationHours: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Duration Minute
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.durationMinute}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        durationMinute: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Rating
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.rating}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        rating: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Director
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.director}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        director: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Writer
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.writer}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        writer: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Release Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.releaseDate}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        releaseDate: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Cast
                  </label>
                  <input
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.cast}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        cast: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.description}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        description: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div class="mb-3">
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        cover: e.target.files[0],
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => handleUpdateMovie(e)}
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;