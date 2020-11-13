/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

// Toogle untuk Menampilkan Circle Preloader
const circleLoader = (condition) => {
    document.getElementById('boxoverlay').style.display = condition;
};

// Toogle untuk Menampilkan Horizontal Preloader
const horizonLoader = (condition) => {
    document.getElementById('ligaLoader').style.display = condition;
};

// Show Error Lewat Toast
const loadError = (error) => M.toast({ html: error });

// Initialize Collapsible Div
const divCollapse = (elClass) => M.Collapsible.init(document.querySelectorAll(elClass), {
    accordion: false,
});

// Initialize Sidenav
const getSideNav = () => M.Sidenav.init(document.querySelectorAll('.sidenav'), {
    isDragged: true,
});

// Initialize Fiture Tabs
const getTabs = () => M.Tabs.init(document.getElementsByClassName('tab'));

// Initialize Modal
const getModal = () => M.Modal.init(document.getElementById('boxmodal'), {
    onCloseEnd() {
        document.body.style.overflow = '';
    },
});

const closeModal = () => {
    const btnclosemodal = document.getElementsByClassName('btnclosemodal');
    for (let i = 0; i < btnclosemodal.length; i++) {
        btnclosemodal[i].addEventListener('click', () => {
            getModal().close();
            document.body.style.overflow = '';
            document.getElementById('boxmodal').innerHTML = '';
        });
    }
};

// Float Button on Mobile & Ipad Display
const floatBtn = () => M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {
    direction: 'left',
});

// Memberikan underline pada Link yang Aktif
const activBtn = (btnClass) => {
    const current = document.getElementsByClassName('btn-active');
    current[0].className = current[0].className.replace(' btn-active', '');
    btnClass.className += ' btn-active';
};

// Tombol Scroll Up muncul ketika halaman di scroll
const goUpBtn = () => {
    const mybutton = document.getElementById('goTop');
    const scrollFunction = () => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = 'block';
        } else {
            mybutton.style.display = 'none';
        }
    };

    window.onscroll = function () {
        scrollFunction();
    };

    mybutton.addEventListener('click', () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });
};

// Memecah array menjadi n bagian
const chunkArray = (arr, n) => {
    const chunkLength = Math.max(arr.length / n, 1);
    const chunks = [];
    for (let i = 0; i < n; i++) {
        if (chunkLength * (i + 1) <= arr.length)chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
    }
    return chunks;
};

// Id Liga pada web app ini
const idLiga = [2001, 2002, 2003, 2014, 2015, 2017, 2019, 2021];

// Referensi Liga
const refLiga = {
    'Primera Division': {
        id: 2014,
        code: 'PD',
        country: 'Spain',
    },
    'Premier League': {
        id: 2021,
        code: 'PL',
        country: 'England',
    },
    'UEFA Champions League': {
        id: 2001,
        code: 'CL',
        country: 'Europe',
    },
    'Ligue 1': {
        id: 2015,
        code: 'FL1',
        country: 'France',
    },
    Bundesliga: {
        id: 2002,
        code: 'BL1',
        country: 'Germany',
    },
    Eredivisie: {
        id: 2003,
        code: 'DED',
        country: 'Netherlands',
    },
    'Serie A': {
        id: 2019,
        code: 'SA',
        country: 'Italy',
    },
    'Primeira Liga': {
        id: 2017,
        code: 'PPL',
        country: 'Portugal',
    },
};

// Referensi Posisi Liga pada Peta
const geoLocLiga = [{
    latitude: 40.416775,
    longitude: -3.703790,
    imageURL: '../assets/images/2014.png',
    value: 20,
    title: 'Primera Division',
}, {
    latitude: 53.4120954,
    longitude: -3.0561399,
    imageURL: '../assets/images/2021.png',
    value: 20,
    title: 'Premier League',
}, {
    latitude: 48.856614,
    longitude: 2.352222,
    imageURL: '../assets/images/2015.png',
    value: 20,
    title: 'Ligue 1',
}, {
    latitude: 48.1548895,
    longitude: 11.4717963,
    imageURL: '../assets/images/2002.png',
    value: 20,
    title: 'Bundesliga',
}, {
    latitude: 52.229676,
    longitude: 4.8339211,
    imageURL: '../assets/images/2003.png',
    value: 20,
    title: 'Eredivisie',
}, {
    latitude: 45.0701176,
    longitude: 7.6000497,
    imageURL: '../assets/images/2019.png',
    value: 20,
    title: 'Serie A',
}, {
    latitude: 38.7436057,
    longitude: -9.2302432,
    imageURL: '../assets/images/2017.png',
    value: 20,
    title: 'Primeira Liga',
}, {
    latitude: 44.3125126,
    longitude: 1.5243391,
    imageURL: '../assets/images/2001.png',
    value: 20,
    title: 'UEFA Champions League',
}];

// Array Nama Bulan
const strippedMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

// Ubah String ke Tanggal
const strtoDate = (str) => {
    const d = new Date(str);

    return `${d.getDate()} ${strippedMonth[d.getMonth()]} ${d.getFullYear().toString().substr(2, 2)}`;
};

// Text Proper Style
const stringToProper = (str) => str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
);

// Hitung umur
const calculateAge = (birthday) => {
    const d = new Date(birthday);
    const ageDifMs = Date.now() - d.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// visualisasi pertandingan terakhir
const fiveLastMatch = (form) => {
    let fhtml = '';
    form.split(',').map((frm, index) => {
        fhtml += `<img class="imglastmatch" src="../assets/icons/${frm}.svg" width="20px" />`;

        return index;
    });

    return fhtml;
};

// Detil data ditampilkan ke boxmodal sesuai ID yang diketahui dari class yang diakses
const getDetil = (dclass, func, stoppropa = false) => {
    const btn = document.getElementsByClassName(dclass);
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', (e) => {
            func(btn[i].id.split('x')[1]);
            if (stoppropa) {
                e.stopPropagation();
            }
        });
    }
};

const Utils = {
    circleLoader,
    horizonLoader,
    divCollapse,
    getSideNav,
    getTabs,
    getModal,
    closeModal,
    floatBtn,
    activBtn,
    goUpBtn,
    chunkArray,
    idLiga,
    refLiga,
    geoLocLiga,
    strtoDate,
    fiveLastMatch,
    stringToProper,
    calculateAge,
    loadError,
    getDetil,
};

export default Utils;
