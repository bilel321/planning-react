import React, { useState, useEffect } from "react";

import fbIcon from "../images/fbIcon.png";
import instaIcon from "../images/instaIcon.png";
import linkedinIcon from "../images/linkedinIcon.png";

import fbIconSM from "../images/sm/fb.svg";
import instaIconSM from "../images/sm/insta.svg";
import linkedinIconSM from "../images/sm/ln.svg";

import toast, { Toaster } from "react-hot-toast";
import { AppProvider, AppContext } from "./Context";
import API from "./Api";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import randomColor from "randomcolor";

const SocialIcon = (props) => {
  let t = props.type;
  let c = props.className;
  let i = fbIcon;
  if (t == "instagram") i = instaIcon;
  else if (t == "linkedin") i = linkedinIcon;
  if (props.small) {
    i = fbIconSM;
    if (t == "instagram") i = instaIconSM;
    else if (t == "linkedin") i = linkedinIconSM;
  }
  return (
    <img
      src={i}
      className={c || "md:w-12 mr-1 md:mr-12 md:mt-2 md:h-12 w-8 h-8"}
      alt=""
    />
  );
};

const useUtils = (props) => {
  const history = useNavigate();
  const [state, setState] = React.useContext(AppContext);

  return {
    history,
    state,
    setState,
    goTo: (url) => {
      history(url.replace(":pageId", state?.currentPage?.page_id));
    },
  };
};

function* colorGeneratorFn() {
  let i = 0;
  let c;
  while (true) {
    if (i % 3 == 0) c = randomColor({ hue: "blue", luminosity: "bright" });
    else c = randomColor({ hue: "green", luminosity: "bright" });
    yield c;
    i++;
  }
}
let colorsList = [
  "#45a3db",
  "#4cbbb6",
  "#3F61AA",
  "#429fbd",
  "#45a3db",
  "#4cbbb6",
  "#45a3db",
  "#4cbbb6",
  "#f7ad1b",
];

let colorGenerator = colorGeneratorFn();
let colorIdx = 0;
let getNextColor = () => {
  return colorsList[colorIdx++ % colorsList.length];
  //return randomColor({hue: '#45a3db'});
  //return colorGenerator.next().value;
};

export {
  SocialIcon,
  toast,
  API,
  AppProvider,
  AppContext,
  Loader,
  useUtils,
  getNextColor,
};
