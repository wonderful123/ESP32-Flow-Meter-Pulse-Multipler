// Navbar.js
import m from 'mithril';
import IconGear from 'icons/IconGear';

const navTitle = 'PulseScaler';

const Navbar = {
  isOpen: false,
  toggleMenu: function () {
    Navbar.isOpen = !Navbar.isOpen;
  },
  // Render the brand part of the navbar
  renderBrand: function () {
    return m('a.navbar-item', {
      href: '#/'
    }, [
      m("span.icon.is-medium", [
        m(IconGear, {
          class: "icon",
          style: "width: 1.5rem; height: auto;"
        }),
      ]),
      m('span.subtitle', navTitle)
    ]);
  },
  // Render the burger menu button
  renderBurger: function () {
    return m('.navbar-burger', {
      role: 'button',
      class: Navbar.isOpen ? 'is-active' : '',
      'aria-label': 'menu',
      'aria-expanded': Navbar.isOpen ? 'true' : 'false',
      onclick: Navbar.toggleMenu
    }, [
      m('span', {
        'aria-hidden': 'true'
      }),
      m('span', {
        'aria-hidden': 'true'
      }),
      m('span', {
        'aria-hidden': 'true'
      })
    ]);
  },
  // Render the navigation links
  renderLinks: function () {
    return [
      m('a.navbar-item', {
        href: '#/calibration'
      }, 'Calibration'),
      m('a.navbar-item', {
        href: '#/firmware'
      }, 'Firmware'),
      m('a.navbar-item', {
        href: '#/about'
      }, 'About')
    ];
  },
  view: function () {
    return m('nav.navbar', {
      role: 'navigation',
      'aria-label': 'main navigation'
    }, [
      m('.navbar-brand', [
        Navbar.renderBrand(),
        Navbar.renderBurger()
      ]),
      m('.navbar-menu', {
        class: Navbar.isOpen ? 'is-active' : ''
      }, [
        m('.navbar-end', Navbar.renderLinks())
        // Include .navbar-end here if you have items to align to the right
      ])
    ]);
  }
};

export default Navbar;