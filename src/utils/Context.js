import React, { useState, useEffect } from "react";
import API from "./Api";
import axios from "axios";
import dayjs from 'dayjs';

const AppContext = React.createContext();

let defaultValue =
  (localStorage.getItem("storedContext") &&
    JSON.parse(localStorage.getItem("storedContext"))) ||
  {};

if (!defaultValue.reportingPeriod)
defaultValue.reportingPeriod = [dayjs().subtract(1, 'year').toDate(), dayjs().toDate()];

axios.interceptors.request.use((request) => {
  let defaultValue =
    (localStorage.getItem("storedContext") &&
      JSON.parse(localStorage.getItem("storedContext"))) ||
    {};
  if (defaultValue.token) {
    request.headers.common["Authorization"] = `Bearer ${defaultValue.token}`;
  }
  return request;
});

axios.interceptors.response.use(function (response) {  
  return response;
}, function (error) {
  debugger;
  return Promise.reject(error);
});

const AppProvider = (props) => {
  const [state, setState] = useState(defaultValue);
  return (
    <AppContext.Provider value={[state, setState]}>
      {props.children}
    </AppContext.Provider>
  );
};


export {
  AppContext,
  AppProvider,
};

