import React, { useEffect, useState } from "react";
import './styles.scss'
import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AuthLogin } from "../../redux/actions/Auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';


const Login = () => {
  const [password, setPassword] = useState(false);
  const togglePassword = () => {
    setPassword(!password);
  };

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading, isLogin } = useSelector((state) => state.auth);
  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(AuthLogin(formLogin));
  };
  useEffect(() => {
    if (isLogin === true) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [isLogin]);

  return (
    <>
     <div className="login">
        <div className="login-box">
          <h1>LOGIN</h1>
          <hr />
          <form onSubmit={handleLogin}>
            <br />
            <PersonIcon className="icon"/>
            <input type="email" placeholder="Enter your email" required onChange={(e) => {
                setFormLogin((prevData) => ({
                  ...prevData,
                  email: e.target.value,
                }));
              }}/>
            <br />
            <br />
            <LockOutlinedIcon className="icon"/>
            <input type={password ? "text" : "password"} placeholder="Enter your password" required onChange={(e) => {
                setFormLogin((prevData) => ({
                  ...prevData,
                  password: e.target.value,
                }));
              }}/>
            <VisibilityIcon style={{marginLeft: '-25px', color: '#f0f0f0', fontSize: "20px"}} onClick={togglePassword} />
            <br />
            {loading ? (
              <button className="btn btn-primary" disabled={true}>
                Loading...
              </button>
            ) : (
              <button>LOGIN</button>
            )}
            {error && <div className="text-center err" style={{color: 'red'}}>{error.message}</div>}
            <div className="line d-flex">
              <hr />
              <p>OR</p>
              <hr />
            </div>
            <button>REGISTER</button>
          </form>
        </div>
      </div> 
    </>
  );
};

export default Login;