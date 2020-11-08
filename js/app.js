/* eslint-disable import/extensions */
/* eslint-disable no-undef */

import Utils from './utils.js';
import Routing from './routing.js';

document.addEventListener('DOMContentLoaded', () => {
    Routing.activePage();

    Routing.navigateBtn();

    Utils.getSideNav();

    Utils.getTabs();

    Utils.goUpBtn();

    Utils.floatBtn();

    Utils.getModal();
});
