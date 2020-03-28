import React from "react";
import axios from "axios";
import './Login.css';
// Global Context
import { GlobalUsersContext } from "../Context/GlobalUsersMessage";

function Login(props) {
  const contextUsers = React.useContext(GlobalUsersContext);
  // console.log(context)
  // Deconstruct
  const { openLogin, openModalLogin } = props;
  // Set State
  const [email, setEmail] = React.useState("");
  const [psw, setPsw] = React.useState("");

  // console.log(fetchSuccess.user)
  // FETCH ERROR
  const [username, setUsername] = React.useState({
    message: 'Fill fields'
  });
  const [password, setPassword] = React.useState({
    message: ''
  });


  //*** LOGIN 
  async function loginDB(user) {
    let url = "/user/login";

    // Fetch
    await axios
      .post(url, user)
      .then(response => {
        // console.log(response);
        // Clear errors
        setUsername({ message: '' });
        setPassword({ message: '' });
        // Close modal windows
        openModalLogin();
        // Fetch from context who is logged data
        contextUsers.whoIsLogged()
         // Flash message
         contextUsers.flashMessage(`👌 Login success.`)
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log(error.response.status);
          if (error.response.status === 401) {
            setUsername({ message: '🥺 Invalid Credentials.' });
          }
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
        // console.log(JSON.parse(error.config.data));
        let dd = JSON.parse(error.config.data);
        if (dd.username.length === 0) {
          setUsername({ message: '🚸 Insert Email.' });
        };
        if (dd.password.length === 0) {
          setPassword({ message: '🚸 Insert Password.' });
        };

      });
  };

  //*** ON SUBMIT FUNCTION */
  const onSubmit = e => {
    // Prevent default
    e.preventDefault();
    // Clear errors
    setUsername({ message: '' })
    setPassword({ message: '' })
    // Create an object
    let data = {
      // _id: Math.floor(Math.random() * 1000000000000000) + 'eed231',
      username: email,
      password: psw
    };
    // Run function context add new post
    // console.log(data)
    loginDB(data);
    // Clear form fields
    setEmail("");
    setPsw("");
    // Close modal windows
    // openModalLogin();
  }

  //************************ RETURN */
  return (
    <>
      <div
        className={
          !openLogin
            ? "info-modal-window"
            : "info-modal-window info-modal-window-show"
        }
      >
        <div className="info-modal-windows-up">
          <button onClick={() => openModalLogin()} className="info-modal-close">
            X
          </button>

          <div className='login-messages'>
            {
              username.message ? (
                <>
                  <div className='errorDiv'> {username.message} </div>
                </>
              )
                :
                null
            }
            {
              password.message ? (
                <>
                  <div className='errorDiv'>  {password.message} </div>
                </>
              )
                :
                null
            }
          </div>
          <form onSubmit={onSubmit} className="info-modal-form">
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

export default React.memo(Login);