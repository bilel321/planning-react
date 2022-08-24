import React, { useState, useEffect, useRef, useContext } from "react";
// import PageHeader from "../Reporting/PageHeader";
import { SocialIcon, useUtils, Loader } from "../utils";
import { AppContext } from "../utils/Context";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

import { Tooltip } from "primereact/tooltip";
import { useTranslation } from "react-i18next";

// import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import AddPostModal from "./PostModal";

import API from "../utils/Api";
import PostModal from "./PostModal";
import {
  useHistory,
  Link,
  useParams,
  Redirect,
  useLocation,
  useRouteMatch,
} from "react-router-dom";

const Planification = () => {
  //const [state, setState] = React.useContext(AppContext);
  const state = useContext(AppContext);
  const setState = useContext(AppContext);

  const [status, setStatus] = useState("");
  const [ttEvent, setTtEvent] = useState(null);
  const { t, i18n } = useTranslation();
  const params = useParams();
  const ttRef = useRef();
  const fcRef = useRef();
  console.log(params);

  const [event, setEvent] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("state", state);
    if (
      state.pages &&
      params.pageId &&
      (!state.currentPage || state.currentPage.page.id != params.pageId)
    ) {
      let page = (state.pages || []).find((el) => el.page_id == params.pageId);
      if (page)
        setState((s) => {
          return { ...s, currentPage: page };
        });
    }
    loadEvents();
  }, [state.pages, state?.currentPage?.page_id]);

  let events = [];
  for (let el of data) {
    events.push({
      title: el.description,
      date: new Date(el.date),
      id: el.id,
      type: el.type,
      media: el.media,
      tt: <PostModal preview event={el} />,
    });
  }

  const loadEvents = async () => {
    try {
      if (!state?.currentPage) return;
      setStatus("loading");
      const res = await API.plannings.all(state?.currentPage.page_id);
      const response = res?.data?.data;
      console.log("response", response);
      setData(response);
      setStatus("");
    } catch (e) {
      console.log(e);
    }
  };

  const addPost = () => {
    setEvent([]);
    setStatus("adding");
  };

  const handleEventClick = async (clickInfo) => {
    try {
      setTtEvent(null);
      const res = await API.plannings.get(
        state.currentPage.page_id,
        clickInfo.event.id
      );
      setEvent(res?.data?.data);
      console.log(event);
      setStatus("adding");
    } catch (e) {
      console.log(e);
    }
  };

  const eventDidMount = function (info) {
    ttRef?.current?.updateTargetEvents();
  };

  const onBeforeShowTt = (e) => {
    setTtEvent(e.target.fcSeg.eventRange.def.extendedProps.tt);
  };
  const onBeforeHideTt = (e) => {
    setTtEvent(null);
  };

  return (
    <div className="content-dashboard  flex-1">
      <Tooltip
        target=".fc-event"
        autoHide={true}
        ref={ttRef}
        onBeforeShow={onBeforeShowTt}
        onBeforeHide={onBeforeHideTt}
      >
        <div>{ttEvent}</div>
      </Tooltip>
      {/* <PageHeader /> */}
      {status == "loading" ? (
        <Loader />
      ) : (
        <div className="full-calendar mt-8 mx-4 mb-8 text-asap-blue dark:text-diggow-blue">
          <button
            onClick={() => addPost()}
            className="px-8  mb-4   hover:opacity-90  font-Montserrat bg-gradient-to-r text-md font-medium from-diggow-blue    to-diggow-blue py-2 rounded-lg  text-asap-white"
          >
            {t("Ajouter un post")}
          </button>
          <FullCalendar
            ref={fcRef}
            eventClick={handleEventClick}
            defaultView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            plugins={[dayGridPlugin, timeGridPlugin]}
            events={events}
            // eventMouseEnter={handleMouseEnter}
            eventDidMount={eventDidMount}
          />

          {status == "adding" && (
            <AddPostModal
              visible={status == "adding"}
              onHide={() => setStatus("")}
              //  onClick={() => history.push("/welcome")}
              onLoad={() => loadEvents()}
              key={event ? event.id : null}
              event={event}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Planification;
