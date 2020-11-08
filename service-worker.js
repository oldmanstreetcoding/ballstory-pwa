/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'ballstory_v1';

const urlsToCache = [
    '/',
    '/push.js',
    '/notification.svg',
    '/manifest.json',
    '/index.html',
    '/icon.png',
    '/icon-apple.png',
    '/pages/templates/leaguepage.html',
    '/pages/templates/playerpage.html',
    '/pages/templates/teampage.html',
    '/pages/home.html',
    '/pages/leagues.html',
    '/pages/mypages.html',
    '/js/component/clubdetil.js',
    '/js/component/leaguedetil.js',
    '/js/component/matchdetil.js',
    '/js/component/playerdetil.js',
    '/js/vendor/amChart/bullets.js',
    '/js/vendor/amChart/core.js',
    '/js/vendor/amChart/europeHigh.js',
    '/js/vendor/amChart/maps.js',
    '/js/vendor/idb/idb.js',
    '/js/vendor/materialize/materialize.min.js',
    '/js/app.js',
    '/js/ceksw.js',
    '/js/data.js',
    '/js/indb.js',
    '/js/leaguepage.js',
    '/js/mypage.js',
    '/js/routing.js',
    '/js/utils.js',
    '/css/materialize.min.css',
    '/css/styles.css',
    '/assets/icons/league.svg',
    '/assets/icons/applogo.svg',
    '/assets/icons/ball.svg',
    '/assets/icons/exit.svg',
    '/assets/icons/match.svg',
    '/assets/icons/team.svg',
    '/assets/icons/topscore.svg',
    '/assets/icons/stadium.svg',
    '/assets/icons/strategy.svg',
    '/assets/icons/tactic.svg',
    '/assets/icons/player.svg',
    '/assets/icons/D.svg',
    '/assets/icons/delete.svg',
    '/assets/icons/heart.svg',
    '/assets/icons/L.svg',
    '/assets/icons/up-arrow.svg',
    '/assets/icons/W.svg',
    '/assets/images/2001.png',
    '/assets/images/2002.png',
    '/assets/images/2003.png',
    '/assets/images/2014.png',
    '/assets/images/2015.png',
    '/assets/images/2017.png',
    '/assets/images/2019.png',
    '/assets/images/2021.png',
    '/assets/images/hero.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache)),
    );
});

self.addEventListener('fetch', (event) => {
    const baseUrl = 'http://api.football-data.org/v2/';
    if (event.request.url.indexOf(baseUrl) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME)
                .then((cache) => fetch(event.request)
                    .then((response) => {
                        cache.put(event.request.url, response.clone());
                        return response;
                    })),
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true })
                .then((response) => response || fetch(event.request)),
        );
    }
});

self.addEventListener('activate', (event) => {
    console.log('Aktivasi ServiceWorker Baru !');
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (cacheName !== CACHE_NAME && cacheName.startsWith('ball')) {
                    return caches.delete(cacheName);
                }
            }),
        )),
    );
});

self.addEventListener('push', (event) => {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push Message No Payload';
    }
    const options = {
        body,
        icon: 'notification.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options),
    );
});
