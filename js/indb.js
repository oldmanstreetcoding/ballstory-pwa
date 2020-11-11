/* eslint-disable array-callback-return */
/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
/* eslint-disable radix */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

import leagueDetil from './component/leaguedetil.js';
import clubDetil from './component/clubdetil.js';
import playerDetil from './component/playerdetil.js';

// Buka koneksi ke IndexedDB dan buat 4 Object Storage
const dbPromised = idb.open('ballstory-indb', 1, (upgradeDb) => {
    if (!upgradeDb.objectStoreNames.contains('Liga')) {
        const ligaOS = upgradeDb.createObjectStore('Liga', { keyPath: 'id' });
        ligaOS.createIndex('name', 'name', { unique: true });
    }

    if (!upgradeDb.objectStoreNames.contains('Klub')) {
        const klubOS = upgradeDb.createObjectStore('Klub', { keyPath: 'id' });
        klubOS.createIndex('name', 'name', { unique: true });
    }

    if (!upgradeDb.objectStoreNames.contains('Pemain')) {
        const pemainOS = upgradeDb.createObjectStore('Pemain', { keyPath: 'id' });
        pemainOS.createIndex('name', 'name', { unique: true });
    }

    if (!upgradeDb.objectStoreNames.contains('Pertandingan')) {
        const pertandinganOS = upgradeDb.createObjectStore('Pertandingan', { keyPath: 'id' });
        pertandinganOS.createIndex('utcDate', 'utcDate', { unique: true });
    }
});

// Fungsi untuk menyimpan liga, team, pemain dan pertandingan favorite
const myFavorite = (os, data) => {
    dbPromised
        .then((db) => {
            const tx = db.transaction(os, 'readwrite');
            const store = tx.objectStore(os);
            if (os === 'Pertandingan') {
                store.add(data.match);
            } else {
                store.add(data);
            }

            return tx.complete;
        })
        .then(() => {
            let msg = '';
            if (os === 'Pertandingan') {
                msg = `${data.match.homeTeam.name} vs ${data.match.awayTeam.name} Berhasil di Simpan Sebagai ${os} Favorite`;
            } else {
                msg = `${data.name} Berhasil di Simpan Sebagai ${os} Favorite`;
            }

            M.toast({ html: msg });
            console.log(msg);
            if (os === 'Liga') {
                leagueDetil.writeLeagueProfilHtml(data);
            } else if (os === 'Klub') {
                clubDetil.writeTeamProfilHtml(data);
            } else if (os === 'Pemain') {
                playerDetil.writePlayerProfilHtml(data);
            }
        });
};

const saveMyFavorite = (dclass, data) => {
    const btn = document.getElementsByClassName(dclass);
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', () => {
            myFavorite(btn[i].id.split('x')[1], data);
        });
    }
};

// fungsi untuk ambil data dari indexedDB secara promise
const ambilIndexDB = (os) => new Promise((resolve, reject) => {
    dbPromised
        .then((db) => {
            const tx = db.transaction(os, 'readonly');
            const store = tx.objectStore(os);
            return store.getAll();
        })
        .then((result) => resolve(result))
        .catch((error) => reject(error));
});

// Fungsi untuk menghapus data dari indexedDB
const hapusIndexDB = (id, os) => {
    dbPromised
        .then((db) => {
            const tx = db.transaction(os, 'readwrite');
            const store = tx.objectStore(os);
            store.delete(parseInt(id));
            return tx.complete;
        })
        .then(() => {
            M.toast({ html: 'Sukses Hapus Data dari My Favourite Pages' });
            console.log('Sukses Hapus Data dari My Favourite Pages');
            location.reload();
        });
};

const hapusFavourite = (dclass, os) => {
    const btn = document.getElementsByClassName(dclass);
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', (e) => {
            const strconfirm = confirm('Anda Yakin Ingin Menghapus Data ini Dari Favourite ?');
            if (strconfirm) {
                hapusIndexDB(btn[i].id.split('x')[1], os);
            }
            e.stopPropagation();
        });
    }
};

// Fungsi untuk cek apakah data API sudah ada di IndexedDB
const indbVsApi = (indbs, apis) => {
    let x = 0;
    indbs.map((indb) => {
        if (indb.id === apis.id) {
            x++;
        }
    });

    return x;
};

const inDB = {
    saveMyFavorite,
    ambilIndexDB,
    hapusFavourite,
    indbVsApi,
};

export default inDB;
