import React, { useState, useEffect, useContext } from "react";

import sideBarLogo from "../images/sideBarLogo.svg";
import ddarrowUp from "../images/ddArrowUp.svg";
import ddarrowDown from "../images/ddArrowDown.svg";
import assistanceIcon from "../images/assistance.svg";
import addProfileIcon from "../images/addProfile.svg";
import sombreIcon from "../images/sombre.svg";
import logoutIcon from "../images/logout.svg";
import logo_b_txt from "../images/logod.png";

import { Sidebar } from "primereact/sidebar";
import { useMediaQuery } from "react-responsive";

import { InputSwitch } from "primereact/inputswitch";

import { API, Loader, toast, SocialIcon, AppContext } from "../utils";
import {
  useNavigate,
  Link,
  useParams,
  Redirect,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
let socialPage = null;

const PagesList = ({ type, pages, onSelectPage, searchTerm }) => {
  const [fpages, setFpages] = useState([pages]);
  const [visible, setVisible] = useState(true);

  if (!pages || !pages.length) return null;
  pages = pages.filter((page) =>
    page.page?.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  return (
    <div className="flex flex-col mt-8 mx-auto items-center lg:items-start  mr-8 my-pages justify-center">
      <div
        onClick={() => setVisible(!visible)}
        className="flex justify-center mt-2 cursor-pointer has-tooltip"
      >
        <span className="tooltip rounded-lg shadow-lg p-2 bg-asap-white text-xs -mt-10 mx-auto z-60 absolute text-asap-switch font-bold">
          Merci de choisir une marque
        </span>

        <div className="flex gap-3  items-center ">
          <SocialIcon type={type} className="pl-4" small />
          <p
            style={{
              color: "#CECFCF",
            }}
            className="font-Montserrat text-center  font-bold "
          >
            {type}
          </p>
          <img
            className={`${
              type == "facebook"
                ? "pl-16"
                : type == "instagram"
                ? "pl-14 ml-1"
                : "pl-16 ml-3"
            }`}
            src={visible ? ddarrowDown : ddarrowUp}
            alt=""
          />
        </div>
      </div>

      {visible && (
        <div className="social-container flex flex-col  md:max-h-44  items-center relative mt-2">
          <ul className="dropdown-menu text-asap-text pt-2 px-7  md:overflow-auto justify-center ">
            {(pages || []).map((el) => (
              <li
                onClick={() => onSelectPage(el)}
                key={el.id}
                className={`block whitespace-nowrap ${
                  socialPage === el.page?.id
                    ? "bg-asap-gray-900 text-asap-blue dark:text-asap-white dark:bg-gray-900"
                    : null
                }  dark:hover:bg-gray-900  hover:bg-asap-gray-900  hover:text-asap-blue dark:hover:text-asap-white rounded-lg px-4 py-3 cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-8 h-8 rounded-xl"
                    src={el.page.picture}
                    alt=""
                  />
                  <p className="font-Montserrat text-xs font-medium truncate">
                    {el.page.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default (props) => {
  const isLargeScreen = useMediaQuery({ query: "(min-width: 869px)" });
  const [status, setStatus] = useState();
  const [state, setState] = React.useContext(AppContext);
  const history = useNavigate();

  const onSelectPage = (page) => {
    socialPage = page.page.id;
    setState((s) => {
      return { ...s, currentPage: page };
    });
    history(`/reporting/${page.page_id}`);
  };

  const openAssistance = () => {
    window.tidioChatApi.hide();
    window.tidioChatApi.close();
    window.tidioChatApi.show();
    window.tidioChatApi.open();
  };

  let searchTerm = state.searchTerm || "";

  let pagesByType = {};
  if (state.pages) {
    state.pages.forEach(
      (el) =>
        (pagesByType[el.social_type] = [
          ...(pagesByType[el.social_type] || []),
          el,
        ])
    );
  }

  const html = document.querySelector("html");

  const [checked1, setChecked1] = useState(false);

  const toggleDarkMode = function (e) {
    setChecked1(!checked1);
    checked1 ? html.classList.remove("dark") : html.classList.add("dark");
    !checked1
      ? localStorage.setItem("dark", "yes")
      : localStorage.removeItem("dark");
  };

  useEffect(() => {
    if (localStorage.getItem("dark")) {
      setChecked1(true);
      html.classList.add("dark");
    }
  }, []);

  const { t, i18n } = useTranslation();

  return (
    <>
      <Sidebar
        baseZIndex={0}
        fullScreen={state.sideBarVisible && !isLargeScreen}
        maskClassName="lg:w-80"
        className="bg-asap-white  dark:bg-diggow-dark-300 shadow-2xl drop-shadow-2xl p-2 absolute z-50"
        visible={state.sideBarVisible}
        dismissable={!isLargeScreen}
        onHide={() => setState((s) => ({ ...s, sideBarVisible: false }))}
      >
        <Link to="/welcome">
          <img
            className="mx-auto d-logo mt-16 mb-20 w-11/12 h-11/12 "
            src={logo_b_txt}
            alt=""
          />
        </Link>

        {/* {status == 'loading' && <Loader />} */}
        {["facebook", "instagram", "linkedin"].map((el) => (
          <PagesList
            key={el}
            type={el}
            pages={pagesByType[el]}
            onSelectPage={onSelectPage}
            searchTerm={searchTerm}
          />
        ))}

        <div className="flex  mt-32 lg:mt-32 cursor-pointer relative mr-8 ">
          <div className="flex gap-3 mr-14 pr-2 ">
            <img className="" src={assistanceIcon} alt="" />
            <a
              style={{
                color: "#CECFCF",
              }}
              className="font-Montserrat font-bold"
              onClick={openAssistance}
            >
              {t("Options.Assistance")}
            </a>
          </div>
          <img className="absolute ml-52 mt-1" src={ddarrowUp} alt="" />
        </div>

        <div className="flex  mt-6 cursor-pointer relative mr-8 ">
          <div className="flex gap-3  pr-4 gerer-page">
            <img className=" " src={addProfileIcon} alt="" />
            <Link to="/pages">
              <p
                style={{
                  color: "#CECFCF",
                }}
                className="font-Montserrat font-bold "
              >
                {t("Options.Gérer mes pages")}
              </p>
            </Link>
          </div>
          <img className="absolute ml-52 mt-1" src={ddarrowUp} alt="" />
        </div>

        <div className="flex  mt-14 lg:mt-24 cursor-pointer items-center relative mr-8 ">
          <div className="flex gap-3  pr-8 ">
            <img className="" src={sombreIcon} alt="" />
            <p
              style={{
                color: "#CECFCF",
              }}
              className="font-Montserrat font-bold"
            >
              {t("Options.Mode sombre")}
            </p>
          </div>

          <div className="flex items-center  absolute ml-48  ">
            {/* <label
              htmlFor="toogleA"
              className="flex items-center cursor-pointer"
            >
              <div className="relative">
                <input id="toogleA" type="checkbox" className="sr-only" />
                <div className="w-10 h-4 bg-asap-white border-2 border-asap-switch rounded-full shadow-inner"></div>
                <div className="dot absolute w-6 h-6 bg-asap-switch rounded-full shadow -left-1 -top-1 transition"></div>
              </div>
            </label> */}
            <InputSwitch
              checked={checked1}
              onChange={(e) => toggleDarkMode(e)}
              className="h-5"
            />
          </div>
        </div>

        <div
          onClick={API.user.closeSession}
          className="flex   mt-6 cursor-pointer relative mr-8 "
        >
          <div className="flex gap-3  pr-6 mb-4">
            <img className=" " src={logoutIcon} alt="" />
            <p
              style={{
                color: "#CECFCF",
              }}
              className="font-Montserrat font-bold"
            >
              {t("Options.Se déconnecter")}
            </p>
          </div>
        </div>
      </Sidebar>
      {!state.sideBarVisible && (
        <div className="navBtn z-50">
          <i
            onClick={() => setState((s) => ({ ...s, sideBarVisible: true }))}
            style={{
              fontSize: "1.5rem",
              padding: "0.8rem",
              color: "#CECFCF",
              position: "fixed",
              top: 0,
              left: 5,
            }}
            className="pi pi-align-left font-bold mt-5 cursor-pointer"
          ></i>
        </div>
      )}
    </>
  );
};
