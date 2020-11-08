/* eslint-disable no-plusplus */
/* eslint-disable import/extensions */
import Utils from './utils.js';
import SumberData from './data.js';
import loadLeaguePage from './leaguepage.js';
import loadMyPage from './mypage.js';

// Fetch halaman homepage
const loadHomePage = () => SumberData.ambilKonten('../pages/home.html', 'body-content');

// Router navigasi aplikasi
const Router = (page) => {
    if (page === 'mypages') {
        loadMyPage();
    } else if (page === 'leagues') {
        loadLeaguePage();
    } else {
        loadHomePage();
    }
};

// Navigasi sesuai Hash URL
const activePage = () => Router(window.location.hash.split('#')[1]);

// NavHeader dan SideNav menggunakan fungsi ini untuk Navigasi
const navigateBtn = () => {
    const btnav = document.querySelectorAll('.btn-nav');
    for (let i = 0; i < btnav.length; i++) {
        btnav[i].addEventListener('click', () => {
            Utils.activBtn(btnav[i]);
            const href = btnav[i].getAttribute('href').split('#')[1];
            Router(href);
        });
    }
};

const Routing = {
    activePage,
    navigateBtn,
};

export default Routing;
