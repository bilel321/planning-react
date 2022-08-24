import React, { Component, useState, useRef, useEffect } from "react";

import styled from "styled-components";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Input from "./components/Input";
import Button from "./components/Button";
import Icon from "./components/Icon";
import Post from "./components/Post";
import User from "./components/User";
import LoginForm from "./components/LoginForm";
import InputField from "./components/InputField";
import SubmitButton from "./components/SubmitButton";
import { async } from "react-async";
import { Login, Register } from "./components/login/index";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Routes } from "react-router-dom";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import Planification from "./components/Planification";
import { useNavigate } from "react-router-dom";

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";       
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
const RightSide = (props) => {
  return (
    <div className="right-side" ref={props.refObject} onClick={props.onClick}>
      <div className="inner-container">
        <div className="text">{props.text}</div>
      </div>
    </div>
  );
};

const AuthCmp = (props) => {
  const [current, setCurrent] = useState(props.first);
  const rightSide = useRef();

  console.log("first", props.first);

  useEffect(() => {
    // debugger;
    if (rightSide.current)
      rightSide.current.classList.add(
        props.first == "login" ? "right" : "left"
      );
  }, [props.first]);

  const navigate = useNavigate();

  let changeState = () => {
    const isLogginActive = current == "login";

    if (isLogginActive) {
      rightSide.current.classList.remove("right");
      rightSide.current.classList.add("left");
    } else {
      rightSide.current.classList.remove("left");
      rightSide.current.classList.add("right");
    }

    setCurrent(current == "login" ? "register" : "login");
    navigate(current == "login" ? "/register" : "/login", {
      replace: true,
      state: current,
    });
  };

  console.log({ rightSide });

  return (
    <div className="login">
      <RightSide
        text={current != "login" ? "Se Connecter" : "S'inscrire"}
        refObject={rightSide}
        onClick={() => changeState()}
      />
      <div className="container">
        {current == "login" && <Login />}
        {current == "register" && <Register />}
      </div>
    </div>
  );
};

class App extends React.Component {
  //   const FacebookBackground =
  //   "linear-gradient(to right, #0546A0 0%, #0546A0 40%, #663FB6 100%)";
  // const InstagramBackground =
  //   "linear-gradient(to right, #A12AC4 0%, #ED586C 40%, #F0A853 100%)";
  // const TwitterBackground =
  //   "linear-gradient(to right, #56C1E1 0%, #35A9CE 50%)";
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true,
    };
  }

  componentDidMount() {
    //Add .right by default
  }

  render() {
    const { isLogginActive } = this.state;
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/calendar" element={<Planification />} />
            <Route
              path="/login"
              element={
                <div>
                  <AuthCmp first="login" />
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div>
                  <AuthCmp first="register" />
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>

      //  <div className="App"><Login/></div>
      //  <MainContainer>
      //    <WelcomeText>Welcome</WelcomeText>
      //     <InputContainer>
      //       <Input type="text" placeholder="Email" />
      //       <Input type="password" placeholder="Password" />
      //     </InputContainer>
      //     <ButtonContainer>

      //       <Button content="Sign Up" />
      //     </ButtonContainer>
      //     <Post></Post>
      //     <LoginWith>Or Login With</LoginWith>
      //     <HorizontalRule></HorizontalRule>
      //     <IconsContainer>
      //       <Icon color={FacebookBackground}>
      //         <FaFacebookF />
      //       </Icon>
      //       <Icon color={InstagramBackground}>
      //         <FaInstagram />
      //       </Icon>
      //       <Icon color={TwitterBackground}>
      //         <FaTwitter />
      //       </Icon>
      //     </IconsContainer>
      //     <ForgotPassword>Forgot password ?</ForgotPassword>
      //   </MainContainer>
    );
  }
}

// const MainContainer = styled.div`
//   display: flex;
//   align-items: center;
//   flex-direction: column;
//   height: 80vh;
//   width: 30vw;
//   background: rgba(255, 255, 255, 0.15);
//   box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
//   backdrop-filter: blur(8.5px);
//   border-radius: 10px;
//   color: #ffffff;
//   text-transform: uppercase;
//   letter-spacing: 0.4rem;
//   @media only screen and (max-width: 320px) {
//     width: 80vw;
//     height: 90vh;
//     hr {
//       margin-bottom: 0.3rem;
//     }
//     h4 {
//       font-size: small;
//     }

// `;
// const WelcomeText = styled.h2`
//   margin: 3rem 0 2rem 0;

// `;
// const InputContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-around;
//   align-items: center;
//   height: 20%;
//   width: 100%;
// `;

// const ButtonContainer = styled.div`
//   margin: 1rem 0 2rem 0;
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const LoginWith = styled.h5`
//   cursor: pointer;
// `;
// const HorizontalRule = styled.hr`
//   width: 90%;
//   height: 0.3rem;
//   border-radius: 0.8rem;
//   border: none;
//   background: linear-gradient(to right, #14163c 0%, #03217b 79%);
//   background-color: #ebd0d0;
//   margin: 1.5rem 0 1rem 0;
//   backdrop-filter: blur(25px);
// `;

// const IconsContainer = styled.div`
//   display: flex;
//   justify-content: space-evenly;
//   margin: 2rem 0 3rem 0;
//   width: 80%;
// `;

// const ForgotPassword = styled.h4`
//   cursor: pointer;
// `;

export default App;
