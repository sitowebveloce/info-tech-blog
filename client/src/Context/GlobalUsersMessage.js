// https://www.youtube.com/watch?v=imjfiXxvMD8
// https://www.youtube.com/watch?v=snzS7-73SEQ
import React, { createContext, useReducer } from "react";
import UsersReducer from "./UsersReducer";
import axios from 'axios';

//******************** CREATE GLOBAL STATE USING createContext */
// pass in the initial state.
export const GlobalUsersContext = createContext();
// To use the global state inside the component
// you need to create a PROVIDER and wrap all CHILDREN COMPONENT!
export const GlobalUsersProvider = ({ children }) => {

  //*** FLASH MESSAGE LOGIC, SET AND CLEAR AFTER n SECONDS
  const flashMessage = (message) => {
    dispatch({
      type: "NEW_MESSAGE",
      payload: message
    });
    setTimeout(() => {
      dispatch({
        type: "CLEAR_MESSAGE",
        payload: ''
      });
    }, 8000)

  };

  //*** FETCH LOGGED IN USER AND STORE IN THE GLOBAL CONTEXT */
  async function whoIsLogged() {
    let url = '/user/whoisloggedin';
    await axios
      .get(url)
      .then(response => {
        // console.log(response);
        if (response.data.isAuthenticated === true) {
          dispatch({
            type: 'FETCH_USER_SUCCESS',
            payload: response.data.data
          })
        }
      })
      .catch(error => {
        // console.log(error);
        dispatch({
          type: 'FETCH_USER_ERROR',
          payload: {
            role: 'user',
            _id: 0,
            fname: '',
            lname: '',
            email: '',
            username: '',
            createdAt: ''
          }
        })
      })
  }

  //**** CLEAR USER INFO
  function clearUserSession() {
    dispatch({
      type: 'FETCH_USER_ERROR',
      payload: {}
    });
  };

  //******************* SET INITIAL STATE GLOBAL OBJECT VARIABLE */
  //**** THIS IS THE INITIAL STATE AFTHER DISPACH BECOME THE useReducer 'STATE' */
  let initialState = {
    msg: '',
    user: {
      role: 'user',
      _id: 0,
      fname: '',
      lname: '',
      email: '',
      username: '',
      createdAt: ''
    }

  };


  //*** You need to create the Reducer
  //*** THE LOGIC IS LIKE JAVASCRIPT REDUCE ACCUMULATOR!!!!!!!!
  const [state, dispatch] = useReducer(UsersReducer, initialState);
  // USEEFFECT TO FETCH THE DATA
  React.useEffect(() => {
    // FETCH POSTS ONE TIME
    flashMessage("Wellcome");
    // FETCH USE LOGGED IN INFO
    whoIsLogged();
  }, []);

  // ******** RETURN
  return (
    <GlobalUsersContext.Provider
      value={{
        state, // PASS ALL THE STATE, THAT IS THE INITIAL STATE MODIFIED.
        flashMessage,
        whoIsLogged,
        clearUserSession
      }}
    >
      {children}
    </GlobalUsersContext.Provider>
  );
};
