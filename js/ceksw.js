/* eslint-disable no-mixed-operators */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const requestPermission = () => {
    if ('Notification' in window) {
        Notification.requestPermission()
            .then((result) => {
                if (result === 'denied') {
                    console.log('Fitur Notifikasi Tidak Diijinkan.');
                    return;
                } if (result === 'default') {
                    console.error('Pengguna menutup kotak dialog permintaan ijin.');
                    return;
                }

                if (('PushManager' in window)) {
                    navigator.serviceWorker.getRegistration()
                        .then((registration) => {
                            registration.pushManager
                                .subscribe({
                                    userVisibleOnly: true,
                                    applicationServerKey: urlBase64ToUint8Array('BNplG_PhQHUlq9Or_abzKUPOkG7_fIPfr4VPZkTTshTVuUjs0gTSM6vOI6a9OmYjjazw8WT7HPCZVL6Qcqe_IbQ'),
                                })
                                .then((subscribe) => {
                                    console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                                    console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                                        null, new Uint8Array(subscribe.getKey('p256dh')),
                                    )));
                                    console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                                        null, new Uint8Array(subscribe.getKey('auth')),
                                    )));
                                }).catch((e) => console.error('Tidak dapat melakukan subscribe ', e.message));
                        });
                }
            });
    }
};

// Registrasi Service Worker
const registerServiceWorker = () => {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('ServiceWorker Berhasil di Daftarkan !');
                return registration;
            })
            .catch((err) => {
                console.error('ServiceWorker Gagal di Daftarkan !', err);
            });
    });
};

// Periksa Kompatibilitas ServiceWorker di Browser
if ('serviceWorker' in navigator) {
    registerServiceWorker();
    requestPermission();
} else {
    console.log('ServiceWorker belum didukung browser ini.');
}
