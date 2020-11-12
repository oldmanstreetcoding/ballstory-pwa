/* eslint-disable import/extensions */
/* eslint-disable no-undef */

const baseURL = 'https://api.football-data.org';
const token = {
    'X-Auth-Token': 'ad3d8a2bf95b421dbbda331a42376886',
};

// cek status fetch data dari API
const cekStatus = (response) => {
    if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText));
    }
    return Promise.resolve(response);
};

const responseText = (response) => response.text();

const responseJson = (response) => response.json();

const tampilkanError = (error) => M.toast({ html: error });

// fetch halaman html
const ambilKonten = (sumber, tujuan) => fetch(sumber)
    .then(cekStatus)
    .then(responseText)
    .then((html) => {
        document.getElementById(tujuan).innerHTML = html;
    })
    .catch(tampilkanError);

// fetch data dari API
const ambilData = (api) => new Promise((resolve, reject) => {
    fetch(`${baseURL}${api}`, { headers: token })
        .then(cekStatus)
        .then(responseJson)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
});

// fetch data dari cache storage
const ambilCache = (api) => new Promise((resolve, reject) => {
    caches.match(`${baseURL}${api}`)
        .then((response) => {
            if (response) {
                response.json()
                    .then((result) => resolve(result))
                    .catch((error) => reject(error));
            }
        });
});

const SumberData = {
    ambilKonten,
    ambilData,
    ambilCache,
};

export default SumberData;
