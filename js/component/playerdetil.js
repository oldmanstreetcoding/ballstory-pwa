/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
import SumberData from '../data.js';
import Utils from '../utils.js';
import clubDetil from './clubdetil.js';
import inDB from '../indb.js';

// Tulis data pertandingan terkait pemain
const writePlayerInfoHtml = (idplayer) => {
    // 1. Get Data From Cache
    if ('caches' in window) {
        SumberData.ambilCache(`/v2/players/${idplayer}/matches`)
            // 2. Fill Page With Match Info
            .then((data) => clubDetil.writeTeamInfoHtml(data, 'matches'))
            // 3. Or Show Error
            .catch((error) => Utils.loadError(error))
            // 4. Finally Just Close Horizon PreLoader
            .finally(() => Utils.horizonLoader('none'));
    }

    // 5. Get Match Info From API
    SumberData.ambilData(`/v2/players/${idplayer}/matches`)
        // 6. Fill Page With Match Info
        .then((data) => clubDetil.writeTeamInfoHtml(data, 'matches'))
        // 7. Or Show Error
        .catch((error) => Utils.loadError(error))
        // 8. Finally Just Close Horizon PreLoader
        .finally(() => Utils.horizonLoader('none'));
};

// Tulis data profil pemain
const writePlayerProfilHtml = (playerdata) => {
    const writeHtml = (data, cekexist) => {
        const dtgl = data.dateOfBirth.split('T');

        let btnfav = '';
        if (cekexist > 0) {
            btnfav = `<a title="Unsubscribe Info Terupdate Pemain" class="btn-floating btn-large red pulse favclass btnhapusfavpemainf" id="wx${data.id}">
                        <img class="imglove" src="../../assets/icons/delete.svg" alt=""/>
                    </a>`;
        } else {
            btnfav = `<a title="Subscribe For Latest Player Info" class="btn-floating btn-large teal pulse favclass" id="dxPemain">
                        <img class="imglove" src="../../assets/icons/heart.svg" alt=""/>
                    </a>`;
        }

        const profilHtml = `<div class="card-panel card-border center-align" id="boxavatar">
                            <h5 class="teal-text"><b>${data.name}</b></h5>
                            <img id="imgavaliga" class="" src="assets/icons/player.svg" alt="Player"/>
                            <div>
                                ${btnfav}
                            </div>
                            <p>
                                ${Utils.strtoDate(dtgl[0])} (${Utils.calculateAge(dtgl[0])})<br>
                                ${data.nationality}<br>
                                ${data.position}
                            </p>
                        </div>`;

        document.getElementById('boxprofil').innerHTML = profilHtml;

        if (cekexist > 0) {
            inDB.hapusFavourite('btnhapusfavpemainf', 'Pemain');
        } else {
            inDB.saveMyFavorite('favclass', data);
        }
    };

    // Sandingkan data indexedDB dan data API untuk menentukan tombol favorite
    inDB.ambilIndexDB('Pemain')
        .then((dataplayers) => writeHtml(playerdata, inDB.indbVsApi(dataplayers, playerdata)));
};

const loadPlayerDetil = (idplayer) => {
    // 1. Load Page Skeleton
    SumberData.ambilKonten('../pages/templates/playerpage.html', 'boxmodal')
        .then(() => {
            // 2. Show Horizon PreLoader
            Utils.horizonLoader('block');

            // 3. Get Data From Cache
            if ('caches' in window) {
                SumberData.ambilCache(`/v2/players/${idplayer}`)
                    // 4. Fill Page With Player Profil
                    .then((playerdata) => writePlayerProfilHtml(playerdata))
                    // 5. Or Show Error
                    .catch((error) => Utils.loadError(error));
            }

            // 6. Get Player Profil From API
            SumberData.ambilData(`/v2/players/${idplayer}`)
                // 7. Fill Page With Player Profil
                .then((playerdata) => writePlayerProfilHtml(playerdata))
                // 8. Or Show Error
                .catch((error) => Utils.loadError(error));

            // 9. Load Player Info
            writePlayerInfoHtml(idplayer);

            Utils.closeModal();
        });
};

const playerDetil = {
    loadPlayerDetil,
    writePlayerProfilHtml,
};

export default playerDetil;
