// index.js
import m from "mithril";

import "../public/styles/bulma.min.css";
import "../public/styles/bulma-cyborg-theme.css";
import "../public/styles/main.scss";

import MainLayout from "layouts/MainLayout";
import CalibrationPage from "pages/calibration/CalibrationPage"
import FirmwarePage from "components/pages/firmware/FirmwarePage";
import AboutPage from "components/pages/AboutPage";

// Arguments:
// - document.body: root element to mount app to
// - "/": default route path
// - routes: route configuration object with keys as route paths and values as route components
m.route(document.body, "/", {
  "/": {
    render: function () {
      return m(MainLayout, m(CalibrationPage));
    }
  },
  "/firmware": {
    render: function () {
      return m(MainLayout, m(FirmwarePage));
    }
  },
  "/about": {
    render: function () {
      return m(MainLayout, m(AboutPage));
    }
  }
});