// MainLayout.js
import m from "mithril";
import Navbar from "components/common/navbar/Navbar";

const MainLayout = {
  view: function (vnode) {
    return m("div", [
      m(Navbar),
      m("main", vnode.children), // Main content changes based on the route
    ]);
  }
};

export default MainLayout;