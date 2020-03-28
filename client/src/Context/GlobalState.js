// https://www.youtube.com/watch?v=imjfiXxvMD8
// https://www.youtube.com/watch?v=snzS7-73SEQ
import React, { createContext, useReducer } from "react";
import Reducer from "./Reducer";
import axios from "axios";
// IMPORT GLOBAL MESSAGE STATE
import { GlobalUsersContext } from "../Context/GlobalUsersMessage";

//******************** CREATE GLOBAL STATE USING createContext */
// pass in the initial state.
export const GlobalContext = createContext();
// To use the global state inside the component
// you need to create a PROVIDER and wrap all CHILDREN COMPONENT!
export const GlobalProvider = ({ children }) => {
  // SET STATE
  const [isDark, setDark] = React.useState(false);
  // IMPPORT GLOBAL USERS MESSAGE SISTEM
  const contextUsers = React.useContext(GlobalUsersContext);

  //******************* SET INITIAL STATE GLOBAL OBJECT VARIABLE */
  //**** THIS IS THE INITIAL STATE AFTHER DISPACH BECOME THE useReducer 'STATE' */
  let initialState = {
    loading: true,
    fetchError: "",
    next: {},
    prev: {},
    posts: []
  };

  //************************* AXIOS GET FETCH POSTS */
  async function fetchData(page, limit) {
    // let cl = console.log;
    let pageNumb = page || 1;
    let limitNumb = limit || 4;
    // cl(pageNumb)
    // cl(limitNumb)

    let url = `/v1/api?page=${pageNumb}&limit=${limitNumb}`;
    // cl(url)
    await axios
      .get(url)
      .then(response => {
        // console.log(response);
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          // console.log(error.config);
          contextUsers.flashMessage(error.response.data.message);

        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          // console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log('Error', error.message);
        }

        // return console.log(error.response.data);
        dispatch({ type: "FETCH_ERROR" });

      });
  }

  //**************** AXIOS SEARCH POSTS POST  */
  async function searchPostsDB(searchKey) {

    let url = "/searchinfo";
    await axios
      .post(url, { search: searchKey })
      .then(response => {
        // console.log(response);
        dispatch({
          type: "FETCH_SEARCH_SUCCESS",
          payload: response.data
        });

      })
      .catch(error => {
        console.log(error);
        dispatch({ type: "FETCH_ERROR" });
      });
  }

  //************************* AXIOS CREATE NEW POST */
  async function createNewPostDB(post) {
    let url = "/infopost";
    await axios
      .post(url, post)
      .then(response => {
        // console.log(response);
        fetchData();
        contextUsers.flashMessage(response.data.message)
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          // console.log(error.config);
          fetchData();
          contextUsers.flashMessage(error.response.data.message);

        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          // console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log('Error', error.message);
        }

        // return console.log(error.response.data);

      });
  }
  //*********************** AXIOS UPDATE POST */
  async function updatePostDB(id, updatePost) {
    let url = "/updatepost";
    let update = { id: id, updatePost: updatePost };
    await axios
      .post(url, update)
      .then(response => {
        // console.log(response);
        fetchData();
        contextUsers.flashMessage(response.data.message)
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          // console.log(error.config);
          console.log('no update')
          fetchData();
          contextUsers.flashMessage(error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          // console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log('Error', error.message);
        }
        // return console.log(error.response.data);
      });
  }

  //************************ AXIOS POST DELETE POST */
  async function deletePostDB(id) {
    let url = `/deletepost/${id}`;
    await axios
      .post(url)
      .then(response => {
        // console.log(response);
        fetchData();
        contextUsers.flashMessage(response.data.message)
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          // console.log(error.config);
          fetchData();
          contextUsers.flashMessage(error.response.data.message)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          // console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log('Error', error.message);
        }
        // return console.log(error.response.data);

      });
  }

  //*** You need to create the Reducer
  //*** THE LOGIC IS LIKE JAVASCRIPT REDUCE ACCUMULATOR!!!!!!!!
  const [state, dispatch] = useReducer(Reducer, initialState);
  // USEEFFECT TO FETCH THE DATA
  React.useEffect(() => {
    // FETCH POSTS ONE TIME
    fetchData();
  }, []);

  //********** DELETE ACTIONS TO MAKE CALLs TO THE REDUCER */
  function deletePost(id) {
    //console.log(id);
    // Detele post
    deletePostDB(id);
  }
  // Update post
  function updatePost(id, postUpdate) {
    // console.log(id);
    // console.log(postUpdate);
    // Update DB
    updatePostDB(id, postUpdate);
  }
  //*** CREATE POST ACTION  */
  function addPost(post) {
    // console.log(post);
    // Axios create new post in the DB
    createNewPostDB(post);
  }
  //*** SEARCH CONTEXT */
  function searchPosts(searchKey) {
    // console.log(searchKey);
    searchPostsDB(searchKey);
    // Fetch
    // fetchData();
  }
  //*** */ Dark Mode
  const darkMode = () => {
    setDark(!isDark);
  };

  // ******** RETURN
  return (
    <GlobalContext.Provider
      value={{
        state: state, // PASS ALL THE STATE, THAT IS THE INITIAL STATE MODIFIED.
        deletePost,
        updatePost,
        addPost,
        searchPosts,
        fetchData,
        isDark,
        darkMode
      }}
    >
      {children}{" "}
    </GlobalContext.Provider>
  );
};
