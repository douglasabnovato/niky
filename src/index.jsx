/*
 * index.js · ponto de entrada; Bootstrap 5 vem do pacote npm (sem CDN, jQuery ou Popper).
 */
import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
/* fim de index.js */
