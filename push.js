const webPush = require('web-push');

const vapidKeys = {
    publicKey: 'BNplG_PhQHUlq9Or_abzKUPOkG7_fIPfr4VPZkTTshTVuUjs0gTSM6vOI6a9OmYjjazw8WT7HPCZVL6Qcqe_IbQ',
    privateKey: 'XsXVrUbS__DhBFTx1XpeD0ZL7F3GM_wBefLK0qxdry0',
};

webPush.setVapidDetails(
    'mailto:oldmanstreetcoding@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey,
);

const pushSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/fAYNh08ETjo:APA91bGH0-JNBs-wsSXvBstLpUyHpewGSAUj1w3x9TFs18pXmI7rWLmLJgdaJYWhpUZP3T-d3ott27RIFUkIv8muaPPQSW6WvnLlUxGE4WLiYRXAesZBxnCzNXy3Pm6YfyVsuBkabn6w',
    keys: {
        p256dh: 'BK4ITfSEVEcJaUsv5vEodcyOyqc00YUd0xkCtS+5P4p32f/p+c26PdPK1uTdJhn4P45stIQfBcISHtF6Hlrs3r8=',
        auth: 'JGrPZemgDBwM9iD6ggQfKg==',
    },
};

const payload = 'Hai Reviewer ! Selamat Datang di Playground StreetCoding. Terimakasih Sudah Mau Review CodeStory StreetCoding Ya !';

const options = {
    gcmAPIKey: '708140887117',
    TTL: 60,
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options,
);
