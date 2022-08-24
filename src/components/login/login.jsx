import React from "react";
import loginImg from "../../login.svg";
import { useState, useRef, useEffect } from "react";
//import { Calendar } from "../Calendar/Calendar";
import { Routes, Route, useNavigate } from "react-router-dom";
import API from "../../utils/Api";

/* export default class Login extends React.Component {
 */

const Login = (props) => {
  // const navigate = useNavigate();

  // const navigateToCalendar = () => {
  //   // 👇️ navigate to /contacts
  //   navigate('/calendar');
  // };
  // const submit = async () => {

  //  try{
  // const res = await API.user.signin(email,password);
  //  }
  // };

  const [LoginInput, setLogin] = useState({
    Login: [],
    //loading: true,
    email: "",
    password: "",
  });
  const handleInput = (e) => {
    e.persist();
    setLogin({ ...LoginInput, [e.target.name]: e.target.value });
  };
  const saveLogin = (e) => {
    e.preventDefault();
    const data = {
      email: LoginInput.email,
      password: LoginInput.password,
    };
    API.user.signin(data).then((res) => {});
  };
  return (
    <form onSubmit={saveLogin}>
      <div className="base-container" ref={props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                onChange={handleInput}
                value={LoginInput.email}
                placeholder="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                name="password"
                onChange={handleInput}
                value={LoginInput.password}
                placeholder="password"
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="submit" className="btn">
            Login
          </button>
        </div>
      </div>
    </form>
  );
};
/*}*/
export default Login;
