// index.js
import m from "mithril";

import "../public/styles/bulma.min.css";
import "../public/styles/bulma-cyborg-theme.css";
import "../public/styles/styles.css";

import CalibrationPage from "./views/CalibrationPage";

// Define routes
const routes = {
  "/": CalibrationPage
};

// Arguments:
// - document.body: root element to mount app to
// - "/": default route path
// - routes: route configuration object with keys as route paths and values as route components
m.route(document.getElementById("app"), "/", routes);