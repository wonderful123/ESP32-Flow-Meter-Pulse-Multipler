// TitleAndSubtitle.js
import m from "mithril";

const TitleSubtitle = {
  view: function (vnode) {
    return m("div.pb-5", [
      m("h1.title.has-text-centered", vnode.attrs.title),
      m("h3.subtitle.has-text-centered.has-text-grey.mt-1", vnode.attrs.subtitle)
    ]);
  },
};

export default TitleSubtitle;
