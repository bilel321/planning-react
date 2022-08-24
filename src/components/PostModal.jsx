import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

import InputEmoji from "react-input-emoji";
import { editorState, ContentState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";

import moment from "moment";

import { ReactComponent as CalendarIcon } from "../images/calendar.svg";
import { ReactComponent as CalendarArrow } from "../images/calendarArrow.svg";
import navIcon from "../images/dashboardMain/navIcon.svg";
import pUpload from "../images/pupload.png";
import vUpload from "../images/vupload.png";
import animativLogo from "../images/animativ.png";
import emojiLogo from "../images/emoji.png";
//import "./PostModal.css";
import { SocialIcon, useUtils, Loader } from "../utils/index";
import { AppContext } from "../utils/Context";

import API from "../utils/Api";
import { useTranslation } from "react-i18next";

const PostModal = (props) => {
  const { t, i18n } = useTranslation();
  const utils = useUtils();
  let fileObj = [];
  let fileArray = [];
  const [status, setStatus] = useState("");

  const inputRef = React.useRef();
  const imgInputRef = React.useRef();
  const imgsInputRef = React.useRef();

  const [fileobj, setFileobj] = React.useState([]);

  const getVideo = () => {
    if (
      props.event.type == "video" &&
      props.event.media_urls &&
      props.event.media_urls.length === 1
    ) {
      let i = props.event?.media_urls[0];
      return i;
    }
    return null;
  };

  const getImg = () => {
    if (
      props.event.type == "image" &&
      props.event.media_urls &&
      props.event.media_urls.length === 1
    ) {
      let i = props.event?.media_urls[0];
      return i;
    }
    return null;
  };

  const getImgs = () => {
    if (props.event.media_urls && props.event.media_urls.length > 1) {
      return props.event.media_urls;
    }
    return [];
  };

  const [source, setSource] = React.useState(props.event ? getVideo() : null);
  const [img, setImg] = useState(props.event ? getImg() : null);
  const [imgs, setImgs] = useState(props.event ? getImgs() : []);
  const [imgFile, setImgFile] = useState();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImgFile(file);
    const url = URL.createObjectURL(file);
    setSource(url);
    setImg(null);
    setImgs(null);
  };

  const uploadMultipleFiles = (e) => {
    if (e.target.files.length !== 0) {
      fileObj.push(e.target.files);
      setFileobj(fileObj);
      for (let i = 0; i < fileObj[0].length; i++) {
        fileArray.push(URL.createObjectURL(fileObj[0][i]));
      }
      setImgs(fileArray);
      setSource(null);
      setImg(null);
    }
  };

  const handleChoose = (event) => {
    inputRef.current.click();
  };

  const imgHandleChoose = (event) => {
    imgInputRef.current.click();
  };
  const imgsHandleChoose = (event) => {
    imgsInputRef.current.click();
  };

  const [dates2, setDates2] = useState(
    props.event?.date ? new Date(props.event.date) : null
  );
  const [state, setState] = React.useContext(AppContext);
  let currentPage = state.currentPage || {};

  // console.log("props", props.event);

  const [editorState, setEditorState] = useState(() =>
    editorState.createWithContent(
      ContentState.createFromText(props.event.description || "")
    )
  );

  // const succsessFooter = (
  //   <div className="justify-center flex bg-asap-lowWhite ">
  //     <button className="mt-14 px-28 mx-auto hover:opacity-90  font-Montserrat bg-gradient-to-r text-xs font-medium from-diggow-blue  mb-5  to-asap-orange py-4 rounded-full  text-asap-white">
  //       Commencez !
  //     </button>
  //   </div>
  // );

  const formatedTimestamp = () => {
    const d = new Date(dates2);
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().split(" ")[0];
    return `${date} ${time}`;
  };

  // console.log(formatedTimestamp());

  const submit = async () => {
    const formdata = new FormData();
    formdata.append(
      "description",
      editorState.getCurrentContent().getPlainText()
    );
    formdata.append("date", formatedTimestamp());
    if (source) formdata.append("type", "video");
    if (img || imgs) formdata.append("type", "image");
    console.log("imgFile", imgFile);
    if (imgFile) formdata.append("media[]", imgFile);
    console.log("esfef", fileobj);
    if (fileobj.length) {
      for (let i = 0; i < fileobj[0].length; i++) {
        formdata.append("media[]", fileobj[0][i]);
      }
    }
    try {
      setStatus("saving");
      if (props.event.id) {
        const res = await API.plannings.put(
          currentPage.page_id,
          props.event.id,
          formdata
        );
      } else {
        const res = await API.plannings.create(currentPage.page_id, formdata);
      }
      props.onHide();
      props.onLoad();
    } catch (e) {
      console.log(e);
      setStatus(null);
    }
  };

  const deletePost = async () => {
    try {
      setStatus("deleting");
      const res = await API.plannings.delete(
        currentPage.page_id,
        props.event.id
      );
      props.onHide();
      props.onLoad();
    } catch (e) {
      console.log(e);
    }
  };

  let previewCnt = (
    <div className="apercu-fb text-gray-500">
      {props.preview ? null : (
        <h1 className="text-asap-blue dark:text-diggow-secondary font-medium">
          {t("Planification.Aperçu sur facebook")}{" "}
        </h1>
      )}
      <div className="bg-asap-white shadow rounded-lg  w-96 mt-4 ">
        <img
          className="inline cursor-pointer float-right mt-6 mr-2"
          src={navIcon}
          alt=""
        />
        <div className="flex mb-2 px-4 pt-4">
          <img
            className="w-12 h-12 rounded-full"
            src={currentPage.page?.picture}
          />
          <div className="ml-2 mt-0.5">
            <span className="block font-medium text-base  leading-snug text-black">
              {currentPage.page?.name}
            </span>
            <span className="block text-sm text-gray-500  font-light leading-snug">
              {new Date(dates2).toDateString()}
            </span>
          </div>
        </div>
        <p className="text-black  leading-snug md:leading-normal text-xs px-4 line-clamp-3 mt-4 mb-4 pb-4">
          {editorState.getCurrentContent().getPlainText()}
        </p>
        {source && (
          <video
            className="VideoInput_video"
            width="100%"
            height={400}
            controls
            src={source}
          />
        )}
        {img && (
          <div>
            <img src={img} alt="preview" width="100%" hieght="400" />
          </div>
        )}
        {imgs && (
          <div className="flex flex-wrap">
            {(imgs.slice(0, 5) || []).map((url) => (
              <img
                src={url}
                alt="..."
                width="40%"
                hieght="100"
                className="m-1 flex-1"
              />
            ))}
          </div>
        )}
        <hr className="mt-6" />
        <div className="flex justify-between font-CityOfEmber  mt-2 p-2 text-sm font-bold text-gray-500">
          <span className="cursor-pointer">Like</span>
          <span className="cursor-pointer">Comment</span>
          <span className="cursor-pointer">Share</span>
        </div>
        {/* <p
        style={{
            color: "#3f729b",
        }}
        className=" font-bold dark:text-gray-100 leading-snug md:leading-normal text-xs px-4 pt-1"
        >
        #GalaxyZFlip3
    </p> */}
      </div>
    </div>
  );

  if (props.preview) return previewCnt;

  return (
    <Dialog
      breakpoints={{ "960px": "95vw" }}
      style={{ width: "60vw" }}
      className={
        "text-asap-orange font-thin bg-asap-lowWhite dark:bg-gray-900 text-xl font-Montserrat  rounded-3xl p-1  no-background-dialog"
      }
      {...props}
    >
      {/* header */}
      <div className="flex flex-col justify-center mx-auto mt- items-center gap-2 ">
        <h1 className="text-diggow-blue dark:text-diggow-secondary font-medium font-Montserrat mx-auto  md:text-6xl mt-8 ">
          Planning
        </h1>

        {/* <h1 className="text-diggow-secondary animate-pulse text-sm cursor-pointer font-bold">
          Une video Animativ gratuite
        </h1> */}
      </div>

      {/* body */}
      <div className="flex 2xl:flex-row flex-col justify-around mt-24 gap-24">
        <div className="flex flex-col ">
          <div className="outline-none text-asap-blue focus:outline-none ">
            <h1 className="text-asap-blue dark:text-diggow-secondary font-medium">
              {t("Planification.Votre contenu")}
            </h1>
            <div className="mt-4 border rounded-xl">
              <Editor
                wrapperClassName="wrapper-class flex flex-col-reverse  w-96  "
                editorClassName="editor-class   text-md w-full h-full dark:text-asap-white "
                toolbarClassName="toolbar-class  bg-transparent border-0 rounded-full mt-24  "
                editorState={editorState}
                onEditorStateChange={setEditorState}
                toolbarCustomButtons={[
                  <div
                    className="flex items-center "
                    style={{ marginBottom: "0.4rem" }}
                  >
                    <input
                      ref={imgsInputRef}
                      className="hidden"
                      multiple
                      type="file"
                      onChange={uploadMultipleFiles}
                    />

                    <button
                      className="has-tooltip"
                      style={{ marginBottom: "0rem" }}
                      onClick={imgsHandleChoose}
                    >
                      <img src={pUpload} alt="" />
                      <span className="tooltip rounded-lg shadow-lg p-2 bg-asap-white text-xs -mt-14 mx-auto z-60 absolute  text-asap-blue font-medium">
                        Télecharger images(s)
                      </span>
                    </button>

                    <input
                      ref={inputRef}
                      className="hidden"
                      type="file"
                      onChange={handleFileChange}
                      accept=".mov,.mp4"
                    />
                    <button
                      className="ml-2 has-tooltip"
                      style={{ marginTop: "0.2rem" }}
                      onClick={handleChoose}
                    >
                      <span className="tooltip rounded-lg shadow-lg p-2 bg-asap-white text-xs -mt-10 mx-auto z-60  absolute text-asap-blue font-medium">
                        Télecharger vidéo
                      </span>
                      <img src={vUpload} alt="" />
                    </button>

                    {/* <div className="flex items-center ml-2 gap-2  rounded-lg shadow-2xl px-2 an-pulse bg-asap-gray-900">
                      <img src={animativLogo} className="h-4" alt=""/>
                      <a href="https://dev.animativ.io/#/login" target="_blank">
                        <h1>Créer avec animativ</h1>
                      </a>
                    </div> */}
                  </div>,
                ]}
                toolbar={{
                  options: ["emoji"],
                  emoji: {
                    icon: emojiLogo,
                    className: "bg-transparent border-0",
                    component: undefined,
                    popupClassName: undefined,
                  },
                }}
              />
              <div className="flex  items-center">
                {/* <input
                ref={imgInputRef}
                className="hidden"
                type="file"
                onChange={(e) => {
                  setImgFile(e.target.files[0]);
                  const imgUrl = URL.createObjectURL(e.target.files[0]);
                  console.log(imgUrl);
                  if (imgUrl) {
                    setImg(imgUrl);
                    setSource(null);
                    setImgs(null);
                  }
                }}
              />
              <button
                className=" px-8 py-4  hover:opacity-90  font-Montserrat bg-gradient-to-r text-xs font-medium from-diggow-blue   to-diggow-blue  rounded-full  text-asap-white"
                onClick={imgHandleChoose}
              >
                Upload Photo
              </button> */}
                {/* <input
                  ref={imgsInputRef}
                  className="hidden"
                  multiple
                  type="file"
                  onChange={uploadMultipleFiles}
                />
                <button
                  className=" absolute ml-12 font-medium"
                  style={{ marginBottom: "2.6rem" }}
                  onClick={imgsHandleChoose}
                >
                  <img src={pUpload} alt="" />
                </button>
                <input
                  ref={inputRef}
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                  accept=".mov,.mp4"
                />
                <button
                  className=" absolute ml-20 font-medium"
                  style={{ marginBottom: "2.5rem" }}
                  onClick={handleChoose}
                >
                  <img src={vUpload} alt="" />
                </button> */}
              </div>
            </div>
            {/* <input
              ref={imgsInputRef}
              className="hidden"
              multiple
              type="file"
              onChange={uploadMultipleFiles}
            />
            <button
              className=" mt-4 px-8 py-4  hover:opacity-90  font-Montserrat bg-gradient-to-r text-xs font-medium from-diggow-blue  to-diggow-blue  rounded-full  text-asap-white"
              onClick={imgsHandleChoose}
            >
              Upload Album
            </button> */}
          </div>
          <div className="mt-16 ">
            <h1 className="text-asap-blue dark:text-diggow-secondary font-medium">
              Choose date
            </h1>
            <div className="flex bg-asap-gray-900 dark:bg-diggow-dark-300 items-center rounded-lg  p-1 font-CityOfEmber    w-72 mt-4 ">
              <span className="pl-4">
                <CalendarIcon className="text-asap-blue dark:text-asap-white" />
              </span>
              <Calendar
                dateFormat="yy/mm/dd"
                panelClassName="mt-4 bg-asap-gray-900 p-2 font-CityOfEmber text-asap-blue rounded-lg"
                className="font-CityOfEmber"
                inputClassName="cursor-pointer font-CityOfEmber bg-asap-gray-900 outline-none rounded-r-lg px-4 text-asap-blue text-sm font-CityOfEmber dark:text-asap-white"
                value={dates2}
                onChange={(e) => setDates2(e.value)}
                id="time24"
                numberOfMonths={1}
                showTime
                showSeconds
              />
              <span className="pr-5 cursor-pointer">
                <CalendarArrow className="text-asap-blue dark:text-asap-white" />
              </span>
            </div>
          </div>
        </div>

        {previewCnt}
      </div>

      {/* footer */}
      <div className="justify-center flex bg-asap-lowWhite dark:bg-gray-900">
        {props.event.id ? (
          <div className="flex items-center gap-4">
            <Button
              onClick={submit}
              type="submit"
              iconPos="right"
              label="Editer"
              loading={status == "saving"}
              className="hover:opacity-90  mt-14 mb-8 font-Montserrat bg-gradient-to-r text-xs font-medium from-diggow-blue  to-diggow-blue py-3 rounded-full px-20 text-asap-white"
            />
            <Button
              onClick={deletePost}
              type="submit"
              iconPos="right"
              label="Supprimer"
              loading={status == "deleting"}
              className="hover:opacity-90  mt-14 mb-8 font-Montserrat bg-gradient-to-r text-xs font-medium from-diggow-secondary  to-diggow-secondary py-3 rounded-full px-16 text-asap-white"
            />
          </div>
        ) : (
          <Button
            onClick={submit}
            type="submit"
            iconPos="right"
            label={t("Planification.Ajouter")}
            loading={status == "saving"}
            className="hover:opacity-90  mt-14 mb-8 font-Montserrat bg-gradient-to-r text-sm font-medium from-diggow-blue  to-diggow-blue py-3 rounded-lg px-20 text-asap-white"
          />
        )}
      </div>
    </Dialog>
  );
};

export default PostModal;
