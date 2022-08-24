import React, { useState, useRef, useEffect } from "react";
import loginImg from "../../login.svg";
import API from "../../utils/Api";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// export class Register extends React.Component {
//   constructor(props) {
//     super(props);
//   }
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;
const Register = (props) => {
  // async componentDidMount() {
  //   const res = await axios.get("http://localhost:8000/api/register");
  //   console.log(res);
  //   if (res.data.status === 200) {
  //     setState({
  //       Register: res.data.register,
  //       loading: false,
  //     });
  //   }
  //}
  /*render()*/
  // var register_htmltable = state.register.map((item) => {
  //   return <h2>Welcome {item.name}</h2>;
  // });

  const userRef = useRef();
  const errRef = useRef();

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // useEffect(() => {
  //   setValidPwd(PWD_REGEX.test(pwd));
  //   setValidMatch(pwd === matchPwd);
  // }, [pwd, matchPwd]);

  const [registerInput, setRegister] = useState({
    Register: [],
    //loading: true,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  //pwd = registerInput.password;
  //registerInput.password = pwd;

  // useEffect(() => {
  //   setValidPwd(PWD_REGEX.test(registerInput.password));
  //   console.log()
  //   setValidMatch(
  //     registerInput.password === registerInput.password_confirmation
  //   );
  // }, [pwd, matchPwd]);

  useEffect(() => {
    const result = PWD_REGEX.test(registerInput.password);
    console.log(result);
    console.log(registerInput.password);
    setValidPwd(result);
    const match =
      registerInput.password === registerInput.password_confirmation;
    setValidMatch(match);
  }, [registerInput.password, registerInput.password_confirmation]);

  useEffect(() => {
    setErrMsg("");
  }, [registerInput.password, registerInput.password_confirmation]);

  const handleInput = (e) => {
    e.persist();
    setRegister({ ...registerInput, [e.target.name]: e.target.value });
    setPwd(e.target.value);
  };
  const saveRegister = (e) => {
    e.preventDefault();
    const data = {
      name: registerInput.name,
      email: registerInput.email,
      password: registerInput.password,
    };
    API.user.Register(data).then((res) => {});
  };
  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <form onSubmit={saveRegister}>
        <div className="base-container" ref={props.containerRef}>
          <div className="header">Register</div>
          <div className="content">
            <div className="image">
              <img src={loginImg} />
            </div>
            <div className="form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleInput}
                  value={registerInput.name}
                  placeholder="username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  onChange={handleInput}
                  value={registerInput.email}
                  required
                  placeholder="email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  Password:
                  {/* <FontAwesomeIcon
                  icon={faCheck}
                  className={validPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPwd || !pwd ? "hide" : "invalid"}
                /> */}
                  <span className={validPwd ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className={
                      validPwd || !registerInput.password ? "hide" : "invalid"
                    }
                  >
                    <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                  </span>
                </label>
                <input
                  type="text"
                  //type="password"
                  name="password"
                  id="password"
                  onChange={handleInput}
                  //onChange={(e) => setPwd(e.target.value)}
                  //value={pwd}
                  value={registerInput.password}
                  aria-invalid={validPwd ? "false" : "true"}
                  required
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  placeholder="password"
                />
                <p
                  id="pwdnote"
                  className={
                    pwdFocus && !validPwd ? "instructions" : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  must have at least 6 characters
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{" "}
                  <span aria-label="exclamation mark">!</span>{" "}
                  <span aria-label="at symbol">@</span>{" "}
                  <span aria-label="hashtag">#</span>{" "}
                  <span aria-label="dollar sign">$</span>{" "}
                  <span aria-label="percent">%</span>
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  {" "}
                  Password Confirmation
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validMatch && matchPwd ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validMatch || !matchPwd ? "hide" : "invalid"}
                  />
                </label>
                <input
                  type="text"
                  name="password_confirmation"
                  onChange={handleInput}
                  value={registerInput.password_confirmation}
                  //value={registerInput.password_confirmation}
                  placeholder="password confirmation"
                />
              </div>
            </div>
          </div>
          <div className="footer">
            <button type="submit" className="btn">
              Register
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
//}
export default Register;
