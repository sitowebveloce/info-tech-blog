import React from "react";
import "./App.css";
import Header from "./Component/Header";
import Modal from "./Component/Modal";
import Bodyposts from "./Component/Bodyposts";
import Wrapper from "./Component/Wrapper";
import Signup from './Component/Signup';
import Login from './Component/Login';

//********************** GLOBAL STATE */
import { GlobalProvider } from "./Context/GlobalState";
import { GlobalUsersProvider } from './Context/GlobalUsersMessage';

function App() {
  // State
  const [openModal, setOpenModal] = React.useState(false);
  const [openSignUp, setOpenSignUp] = React.useState(false);
  const [openLogin, setOpenLogin] = React.useState(false);

  //*** Open Modal Post
  const openModalWindow = () => {
    setOpenModal(!openModal);
  };

  //*** Open Modal SignUp
  const openModalSignUp = () => {
    setOpenSignUp(!openSignUp);
  };
  //*** Open Modal Login
  const openModalLogin = () => {
    setOpenLogin(!openLogin);
  };

  //************************* RETURN */
  return (
    // WRAP EVERYTHING INSIDE THE GLOBAL PROVIDER TO USE GLOBAL STATE

    <GlobalUsersProvider>
      <GlobalProvider>
        <Wrapper>
          <div className="App">
            <Header openModalFunc={openModalWindow} openModalSignUp={openModalSignUp} openModalLogin={openModalLogin} />
            <Modal openModal={openModal} openModalFunc={openModalWindow} />
            <Signup openSignUp={openSignUp} openModalSignUp={openModalSignUp} />
            <Login openLogin={openLogin} openModalLogin={openModalLogin} />
            <Bodyposts />
          </div>
        </Wrapper>
      </GlobalProvider>
    </GlobalUsersProvider>

  );
}

export default App;
