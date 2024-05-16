// Button.js
import m from 'mithril';

const Button = {
  view: function (vnode) {
    const {
      onclick,
      text,
      icon,
      classes = '',
      enabled = true,
      isFullWidth = true,
    } = vnode.attrs;

    return m('button.button', {
      class: `${classes}${isFullWidth ? ' is-fullwidth' : ''}${!enabled ? ' is-disabled' : ''}`,
      onclick: enabled ? onclick : null,
      disabled: !enabled,
      'data-clicked': false,
      oncreate: function (vnode) {
        vnode.dom.addEventListener('click', function () {
          this.setAttribute('data-clicked', true);
          setTimeout(() => {
            this.setAttribute('data-clicked', false);
          }, 300);
        });
      },
    }, [
      icon && m(icon, {
        class: 'icon'
      }),
      m('span', text),
    ]);
  },
};

export default Button;