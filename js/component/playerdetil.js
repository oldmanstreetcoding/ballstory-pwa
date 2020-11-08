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
    const dtgl = playerdata.dateOfBirth.split('T');

    const profilHtml = `<div class="card-panel card-border center-align" id="boxavatar">
                            <h5 class="teal-text"><b>${playerdata.name}</b></h5>
                            <img id="imgavaliga" class="" src="assets/icons/player.svg" alt="Player"/>
                            <div>
                                <a title="Subscribe For Latest Player Info" class="btn-floating btn-large teal pulse favclass" id="dxPemain">
                                    <img class="imglove" src="../../assets/icons/heart.svg" alt=""/>
                                </a>
                            </div>
                            <p>
                                ${Utils.strtoDate(dtgl[0])} (${Utils.calculateAge(dtgl[0])})<br>
                                ${playerdata.nationality}<br>
                                ${playerdata.position}
                            </p>
                        </div>`;

    document.getElementById('boxprofil').innerHTML = profilHtml;

    inDB.saveMyFavorite('favclass', playerdata);
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

export default loadPlayerDetil;
