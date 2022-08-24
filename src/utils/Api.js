import axios from "axios";
import Pusher from "pusher-js";
import toast from "react-hot-toast";
import Echo from "laravel-echo";
import {} from "./notification";
import dayjs from "dayjs";
const BASE_URL = "http://localhost:8000" + "/api";

let API = {};
API.user = {
    signin: function ({ email, password }) {
      return axios.post(BASE_URL + "/signin", { email, password });
    },
    signout: function () {
      return axios.get(BASE_URL + "/signout");
    },
    Register: function ({ name, email, password}) {
      return axios.post(BASE_URL + "/register", {
        name,
        email,
        password,
        password_confirmation: password
      });
    },

    setupSession: function (data, state, setState) {
      window.localStorage.setItem("storedContext", JSON.stringify(data));
      setState(data);
      API.init(state, setState);
    },
    closeSession: function () {
      localStorage.clear();
      API.user.signout();
      window.location.reload();
    },
    resetPassword: function (email) {
      return axios.post(BASE_URL + "/password/email", { email });
    },
  
};

API.pages = {
    //get all stored pages
    all: function () {
      return axios.get(BASE_URL + "/pages?include=page");
    },
    put: function (page_id, { title,url,photo }) {
      return axios.put(BASE_URL + "/pages/" + page_id, {
        title,
        url,
        photo,
      });
    },
    
    getPosts: function (page_id, { from, to }) {
      return axios.post(BASE_URL + "/posts", { from, to });
    },
    exportComments: function (page_id, post_id) {
      return axios.post(
        BASE_URL + "/pages/" + page_id + "/posts/" + post_id + "/comments"
      );
    },
    refresh: function (page_id, { post_id, feed }) {
      return axios.post(BASE_URL + "/pages/" + page_id + "/refresh", {
        post_id,
        feed,
      });
    },
    refreshPost: function (page_id, id) {
      return axios.post(BASE_URL + "/pages/" + page_id + "/refresh", { id });
    },
    postPostMedia :function (post_id) {
      return axios.post(BASE_URL + "/postmedias");
    },
    getPostMedia : function (post_id, postmedia_id) {
      return axios.get(BASE_URL + "/postmedias/" + postmedia_id);
    },
  };
  API.users = {
 
    all: function(){
      return axios.get(BASE_URL+ "/users");
    },
    getUser: function(user_id){
      return axios.get(BASE_URL + "/users/"+ user_id);
    }
  };
  API.stats = {
  getOverview:function(user_role){
    return axios.get(BASE_URL + "/stats/overview");
  }
  }
  API.classification = {
    getPayload: function(comment){
      return axios.get("http://localhost/5000/payload?comment");
    } 
  }  
  API.plannings = {
    all: function (page_id) {
      return axios.get(BASE_URL + "/pages/" + page_id + "/plannings");
    },
    get: function (page_id, planning_id) {
      return axios.get(
        BASE_URL + "/pages/" + page_id + "/plannings/" + planning_id
      );
    },
    delete: function (page_id, planning_id) {
      return axios.delete(
        BASE_URL + "/pages/" + page_id + "/plannings/" + planning_id
      );
    },
    put: function (page_id, planning_id, planning_data) {
      return axios.post(
        BASE_URL +
          "/pages/" +
          page_id +
          "/plannings/" +
          planning_id +
          "?_method=put",
        planning_data
      );
    },
    create: function (page_id, planning_data) {
      return axios.post(
        BASE_URL + "/pages/" + page_id + "/plannings",
        planning_data
      );
    },
  };
  


  API.init = async (state, setState, utils) => {
    if (!state?.token) return;
    Promise.all([
      API.user
        .me()
        .then(
          (r) =>
            console.log(r) ||
           /* API.notifications.startEcho(r.data.data.id) ||*/
            setState((s) => ({ ...s, userData: r.data.data }))
        ),
      API.pages
        .all()
        .then(
          (r) => console.log(r) || setState((s) => ({ ...s, pages: r.data.data }))
        ),
    ])
      .then((r) =>
        setState((s) => ({
          ...s,
          loaded: true,
         // sideBarVisible: true,
          //isExpired: false,
          /*reportingPeriod: [
            dayjs().subtract(1, "year").toDate(),
            dayjs().toDate(),
          ],*/
        }))
      )
      .catch((r) => {
        if (r?.response?.status == 401) {
          toast("Votre session a expirée.");
          utils.history("/login");
          return;
        }
        console.error(r);
        //toast("Une erreur est survenue. Merci de réessayer.");
      });
  };
  




export default API;


  