/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) { console.log('Berhasil Load WorkBox'); } else { console.log('Gagal Load WorkBox'); }

workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/push.js', revision: '1' },
    { url: '/notification.svg', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/icon512.png', revision: '1' },
    { url: '/icon256.png', revision: '1' },
    { url: '/icon128.png', revision: '1' },
    { url: '/icon64.png', revision: '1' },
    { url: '/icon-apple.png', revision: '1' },
    { url: '/pages/templates/leaguepage.html', revision: '1' },
    { url: '/pages/templates/playerpage.html', revision: '1' },
    { url: '/pages/templates/teampage.html', revision: '1' },
    { url: '/pages/home.html', revision: '1' },
    { url: '/pages/leagues.html', revision: '1' },
    { url: '/pages/mypages.html', revision: '1' },
    { url: '/js/component/clubdetil.js', revision: '1' },
    { url: '/js/component/leaguedetil.js', revision: '1' },
    { url: '/js/component/matchdetil.js', revision: '1' },
    { url: '/js/component/playerdetil.js', revision: '1' },
    { url: '/js/vendor/amChart/bullets.js', revision: '1' },
    { url: '/js/vendor/amChart/core.js', revision: '1' },
    { url: '/js/vendor/amChart/europeHigh.js', revision: '1' },
    { url: '/js/vendor/amChart/maps.js', revision: '1' },
    { url: '/js/vendor/idb/idb.js', revision: '1' },
    { url: '/js/vendor/materialize/materialize.min.js', revision: '1' },
    { url: '/js/app.js', revision: '1' },
    { url: '/js/ceksw.js', revision: '1' },
    { url: '/js/data.js', revision: '1' },
    { url: '/js/indb.js', revision: '1' },
    { url: '/js/leaguepage.js', revision: '1' },
    { url: '/js/mypage.js', revision: '1' },
    { url: '/js/routing.js', revision: '1' },
    { url: '/js/utils.js', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/styles.css', revision: '1' },
    { url: '/assets/icons/league.svg', revision: '1' },
    { url: '/assets/icons/applogo.svg', revision: '1' },
    { url: '/assets/icons/ball.svg', revision: '1' },
    { url: '/assets/icons/exit.svg', revision: '1' },
    { url: '/assets/icons/match.svg', revision: '1' },
    { url: '/assets/icons/team.svg', revision: '1' },
    { url: '/assets/icons/topscore.svg', revision: '1' },
    { url: '/assets/icons/stadium.svg', revision: '1' },
    { url: '/assets/icons/strategy.svg', revision: '1' },
    { url: '/assets/icons/tactic.svg', revision: '1' },
    { url: '/assets/icons/player.svg', revision: '1' },
    { url: '/assets/icons/D.svg', revision: '1' },
    { url: '/assets/icons/delete.svg', revision: '1' },
    { url: '/assets/icons/heart.svg', revision: '1' },
    { url: '/assets/icons/L.svg', revision: '1' },
    { url: '/assets/icons/up-arrow.svg', revision: '1' },
    { url: '/assets/icons/W.svg', revision: '1' },
    { url: '/assets/images/2001.png', revision: '1' },
    { url: '/assets/images/2002.png', revision: '1' },
    { url: '/assets/images/2003.png', revision: '1' },
    { url: '/assets/images/2014.png', revision: '1' },
    { url: '/assets/images/2015.png', revision: '1' },
    { url: '/assets/images/2017.png', revision: '1' },
    { url: '/assets/images/2019.png', revision: '1' },
    { url: '/assets/images/2021.png', revision: '1' },
    { url: '/assets/images/hero.png', revision: '1' },
], {
    ignoreUrlParametersMatching: [/.*/],
});

workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://api.football-data.org',
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'api-story',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    }),
);

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
