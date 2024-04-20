import React from "react";
import Routes from "./router";
import "react-toastify/dist/ReactToastify.css";
import Provider from "./context";

function App() {
  return (
    <Provider>
      <Routes />
    </Provider>
  );
}

export default App;
