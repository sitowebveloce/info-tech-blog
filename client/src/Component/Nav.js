import React from 'react';
import axios from 'axios';
import { GlobalUsersContext } from '../Context/GlobalUsersMessage';

export default function Nav(props) {

    // STATE
    const [numb, setNumb] = React.useState(17);

    const { open, openDrawer, openModalSignUp, openModalLogin } = props;

    // Global Context
    const contextUsers = React.useContext(GlobalUsersContext);


    //*** FUNCTIONS */

    //*** Change profile img */
    const changeProfileImg = () => {
        //*** Random numbers generator */
        let randomNum = Math.floor(Math.random() * 99);
        setNumb(randomNum);
    };
    //*** LOG OUT */
    const openModalLogout = async () => {
        let url = "/user/logout";
        axios
            .get(url)
            .then(response => {
                // console.log(response);

                if (response.status === 200) {
                    // Flash message
                    contextUsers.clearUserSession();
                    contextUsers.flashMessage(`👌 Logout success.`)
                }
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);

                    const errRes = [];
                    errRes.push(error.response.data);
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
            })

    }

    //**** RETURN 
    return (
        <div>
            <h1>Navigation</h1>
            {/* NAV  */}
            <nav className={!open ? `info-nav` : `info-nav show-nav`}>
                <div className="info-profile-div">
                    <img
                        onClick={changeProfileImg}
                        src={`https://randomuser.me/portraits/men/${numb}.jpg`}
                        alt="info-img-profile"
                        className="info-img-profile"
                    />
                </div>
                <ul className="profile-ul">
                    <li className="profile-li">
                        <a href="/"> Home </a>
                    </li>

                    {contextUsers.state.user._id !== 0 && contextUsers.state.user.fname !== undefined ?
                        (
                            <li className="profile-li">
                                <span onClick={() => { openDrawer(); openModalLogout() }}> LogOut </span>
                            </li>
                        )
                        :
                        (
                            <>
                                <li className="profile-li">
                                    <span onClick={() => { openDrawer(); openModalSignUp() }} > SignUp </span>
                                </li>
                                <li className="profile-li">
                                    <span onClick={() => { openDrawer(); openModalLogin() }}> LogIn </span>
                                </li>
                            </>
                        )
                    }

                </ul>
            </nav>
            <img
                onClick={openDrawer}
                className={!open ? "img-show" : "img-show show-btn"}
                src="img/hamburger-menu.svg"
                alt="img-show"
            />

        </div>
    )
}
