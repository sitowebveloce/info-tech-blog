import React, { createContext } from "react";

//********** Create context
const ThemeContext = createContext();

//********** Define the provider
const ThemeProvider = () => {
  return <ThemeContext.Provider> {props.children} </ThemeContext.Provider>;
};
