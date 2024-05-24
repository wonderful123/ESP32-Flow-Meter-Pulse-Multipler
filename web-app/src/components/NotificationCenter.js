// NotificationCenter.js
import m from 'mithril';
import {
  clearErrors
} from '/actions/errorActions';
import {
  clearUpdates
} from '/actions/updateActions';
import store from '/store/store';

const NotificationCenter = {
  view: () => {
    const {
      errors,
      updates
    } = store.getState();

    return m('.notification-center', [
      m('.columns', [
        m('.column.is-half', [
          m('.box', [
            m('h3.title.is-4', 'Errors'),
            errors.length > 0 ?
            m('ul.content', errors.map(error => m('li', error))) :
            m('p', 'No errors.'),
            m('button.button.is-danger', {
              onclick: () => store.dispatch(clearErrors())
            }, 'Clear Errors'),
          ]),
        ]),
        m('.column.is-half', [
          m('.box', [
            m('h3.title.is-4', 'Updates'),
            updates.length > 0 ?
            m('ul.content', updates.map(update => m('li', update))) :
            m('p', 'No updates.'),
            m('button.button.is-info', {
              onclick: () => store.dispatch(clearUpdates())
            }, 'Clear Updates'),
          ]),
        ]),
      ]),
    ]);
  },
};

export default NotificationCenter;