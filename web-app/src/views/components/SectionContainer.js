// SectionContainer.js
import m from 'mithril';

const SectionContainer = {
  view: function (vnode) {
    return m("section.section",
      m("div.container", vnode.children)
    );
  }
};

export default SectionContainer;