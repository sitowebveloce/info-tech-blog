import React from "react";
import axios from "axios";
import './Signup.css';

// Global Context
import { GlobalUsersContext } from "../Context/GlobalUsersMessage";

function Signup(props) {
  const contextUsers = React.useContext(GlobalUsersContext);
  // console.log(context)
  // Deconstruct
  const { openSignUp, openModalSignUp } = props;
  // Set State
  const [fname, setFname] = React.useState("");
  const [lname, setLname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [psw, setPsw] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [role, setRole] = React.useState("user");

  // FETCH ERROR
  const [fetchError, setFetchError] = React.useState({
    success: false,
    data: [{}]
  });
  //
  async function signUpDB(user) {
    let url = "/user/register";

    await axios
      .post(url, user)
      .then(response => {
        // Close modal windows
        openModalSignUp();
        // Flash message
        contextUsers.flashMessage(`👌 Signup success.`);
        // setFetchSuccess(response.data);
        setFetchError({ success: true, data: [{}] })
        // Fetch user info
        contextUsers.whoIsLogged();

      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          const errRes = error.response.data;
          setFetchError(errRes)
          //console.log(fetchError);
          // console.log(error.response.status);
          // console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          // console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log('Error', error.message);
        }
        // console.log(error.config);
      });
  };


  //*** ON SUBMIT FUNCTION */
  const onSubmit = e => {
    // Prevent default
    e.preventDefault();
    // RESET FETCH ERRORS A
    setFetchError({ success: true, data: [{}] })
    // Create an object
    let data = {
      // _id: Math.floor(Math.random() * 1000000000000000) + 'eed231',
      fname: fname,
      lname: lname,
      email: email,
      password: psw,
      pswConfirm: confirm,
      role
    };

    // Run function context add new post
    // console.log(data)
    signUpDB(data);
    // Clear form fields
    setFname("");
    setLname("");
    setEmail("");
    setPsw("");
    setConfirm("");
    // Close modal windows
    // openModalSignUp();
  }

  //*** ERRORS */
  let resError;
  // console.log(fetchError)
  if (fetchError.data !== undefined) {
    resError = fetchError.data.map(item => {
      if (item.fname !== undefined) { return item.fname }
      if (item.lname !== undefined) { return item.lname }
      if (item.email !== undefined) { return item.email }
      if (item.password !== undefined) { return item.password }
      if (item.role !== undefined) { return item.role }
    }
    );
  }


  //************************ RETURN */
  return (
    <>
      <div
        className={
          !openSignUp
            ? "info-modal-window"
            : "info-modal-window info-modal-window-show"
        }
      >
        <div className="info-modal-windows-up">
          <button onClick={() => openModalSignUp()} className="info-modal-close">
            X
          </button>
          {/* <div className="info-modal-title">Add Info</div> */}
          <div className='signup-messages'>
            {fetchError.success === false ? (
              <div className='errorDiv'> {resError.join(' 🚸 ')} </div>

            )
              :
              null
            }
          </div>

          <form autoComplete="off" onSubmit={onSubmit} className="info-modal-form">
            <div>
              <label htmlFor="fname"></label>
              <input
                type="text"
                name="fname"
                value={fname}
                onChange={e => setFname(e.target.value)}
                className="info-modal-input-title"
                placeholder="First Name"
              // required
              />
            </div>
            <div>
              <label htmlFor="lname"></label>
              <input
                type="text"
                name="lname"
                value={lname}
                onChange={e => setLname(e.target.value)}
                className="info-modal-input-title"
                placeholder="Last Name"
              // required
              />
            </div>
            <div>
              <label htmlFor="email"></label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="info-modal-input-title"
                placeholder="Email"
              // required
              />
            </div>
            <div>
              <label htmlFor="psw"></label>
              <input
                type="password"
                name="psw"
                value={psw}
                onChange={e => setPsw(e.target.value)}
                className="info-modal-input-title"
                placeholder="Password"
              // required
              />
            </div>
            <div>
              <label htmlFor="psw"></label>
              <input
                type="password"
                name="confirm"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="info-modal-input-title"
                placeholder="Confirm"
              // required
              />
            </div>

            <div className="info-modal-select">
              <label htmlFor="select-importance">Role</label>
              <select
                name="importance"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="select-importance"
              >
                <option value="user">User</option>
                <option value="publisher">Publisher</option>

              </select>
            </div>
            <div className="info-modal-submit">
              <button type="submit" className="info-btn-modal-submit">
                Insert
                </button>
            </div>
          </form>
        </div>
      </div >
    </>
  );
}


export default React.memo(Signup);