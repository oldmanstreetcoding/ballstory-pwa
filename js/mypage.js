/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable import/extensions */

import SumberData from './data.js';
import Utils from './utils.js';
import inDB from './indb.js';
import leagueDetil from './component/leaguedetil.js';
import clubDetil from './component/clubdetil.js';
import playerDetil from './component/playerdetil.js';

// 2d. Show Favorite Match Data From IndexDB
const writeMatchProfilHtml = (datamatches) => {
    const profilTxt = (data) => `<div class="card-panel teal-text card-border center-align boxspark boxhfav teal lighten-5">
    <div class="boxdelfav">
        <a title="Click to Unsubscribe" class="btn-floating btn-large red pulse btnhapusfavmatch" id="sx${data.id}">
            <img class="imglove" src="../../assets/icons/delete.svg" alt=""/>
        </a>
    </div>
    <h6><b>${data.competition.name}</b></h6>

    <table>
        <tr>
            <td>
                <img src="https://crests.football-data.org/${data.homeTeam.id}.svg" title="${data.homeTeam.name}" width="35px" alt=""/>
            </td>
            <td>
                ${data.homeTeam.name}
            </td>
            <td>
                ${data.score.fullTime.homeTeam == null ? '-' : data.score.fullTime.homeTeam}
            </td>
        </tr>
        <tr>
            <td>
                <img src="https://crests.football-data.org/${data.awayTeam.id}.svg" title="${data.awayTeam.name}" width="35px" alt=""/>
            </td>
            <td>
                ${data.awayTeam.name}
            </td>
            <td>
                ${data.score.fullTime.awayTeam == null ? '-' : data.score.fullTime.awayTeam}
            </td>
        </tr>
        <tr>
            <td class="center-align" colspan="3">
                ${data.venue}<br>${Utils.strtoDate(data.utcDate.substring(0, 10))}
            </td>
        </tr>
    </table>
    </div>`;

    const writeData = (profil, index) => {
        if (index === 0) {
            document.getElementById('boxfavmatch').innerHTML = profil;
        } else {
            document.getElementById('boxfavmatch').innerHTML += profil;
        }

        inDB.hapusFavourite('btnhapusfavmatch', 'Pertandingan');
    };

    datamatches.map((datamatch, index) => {
        if (datamatch.status === 'FINISHED' || datamatch.status === 'AWARDED') {
            writeData(profilTxt(datamatch), index);
        } else {
            Utils.circleLoader('block');
            SumberData.ambilData(`/v2/matches/${datamatch.id}`)
                .then((data) => writeData(profilTxt(data.match), index))
                .catch((error) => Utils.loadError(error))
                .finally(() => Utils.circleLoader('none'));
        }
    });

    if (datamatches.length > 0) {
        console.log('Sukses Mengambil Data Pertandingan Favorite dari IndexedDB');
    }
};

// 2c. Show Favorite Player Data From IndexDB
const writePlayerProfilHtml = (dataplayers = []) => {
    let profilHtml = '';

    dataplayers.map((dataplayer) => {
        const dtgl = dataplayer.dateOfBirth.split('T');

        profilHtml += `<div data-target="boxmodal" class="card-panel modal-trigger card-border center-align boxspark btndetilpemain boxhfav teal lighten-5" id="px${dataplayer.id}">
                            <div class="boxdelfav">
                                <a title="Click to Unsubscribe" class="btn-floating btn-large red pulse btnhapusfavpemain" id="wx${dataplayer.id}">
                                    <img class="imglove" src="../../assets/icons/delete.svg" alt=""/>
                                </a>
                            </div>
                            <h6 class="teal-text text-titlefav"><b>${dataplayer.name}</b><br></h6>
                            <img class="imgavafav" src="assets/icons/player.svg" alt="Player"/><br>
                            <span class="teal-text">
                                ${Utils.strtoDate(dtgl[0])} (${Utils.calculateAge(dtgl[0])})<br>
                                ${dataplayer.nationality}<br>
                                ${dataplayer.position}
                            </span>
                    </div>`;
    });

    if (dataplayers.length > 0) {
        document.getElementById('boxfavplayer').innerHTML = profilHtml;

        Utils.getDetil('btndetilpemain', playerDetil.loadPlayerDetil);

        inDB.hapusFavourite('btnhapusfavpemain', 'Pemain');

        console.log('Sukses Mengambil Data Pemain Favorite dari IndexedDB');
    }
};

// 2b. Show Favorite Team Data From IndexDB
const writeTeamProfilHtml = (dataclubs = []) => {
    let profilHtml = '';

    dataclubs.map((dataclub) => {
        profilHtml += `<div data-target="boxmodal" class="card-panel modal-trigger card-border center-align boxspark btndetilteam boxhfav teal lighten-5" id="tx${dataclub.id}">
                        <div class="boxdelfav">
                            <a title="Click to Unsubscribe" class="btn-floating btn-large red pulse btnhapusfavteam" id="cx${dataclub.id}">
                                <img class="imglove" src="../../assets/icons/delete.svg" alt=""/>
                            </a>
                        </div>
                        <h6 class="teal-text text-titlefav"><b>${dataclub.name}</b><br></h6>
                        <img class="imgavafav" src="${dataclub.crestUrl}" alt="${dataclub.name}"/><br>
                        <span class="teal-text">
                            ${dataclub.venue}<br>
                            ${dataclub.address}<br>
                            ${dataclub.phone}<br>
                        </span>
                    </div>`;
    });

    if (dataclubs.length > 0) {
        document.getElementById('boxfavteam').innerHTML = profilHtml;

        Utils.getDetil('btndetilteam', clubDetil.loadTeamDetil);

        inDB.hapusFavourite('btnhapusfavteam', 'Klub');

        console.log('Sukses Mengambil Data Klub Favorite dari IndexedDB');
    }
};

// 2a. Show Favorite League Data From IndexDB
const writeLeagueProfilHtml = (dataligas = []) => {
    let profilHtml = '';

    dataligas.map((dataliga) => {
        profilHtml += `<div data-target="boxmodal" class="card-panel modal-trigger card-border center-align boxspark btndetilkompetisi boxhfav teal lighten-5" id="wx${dataliga.id}">
                        <div class="boxdelfav">
                            <a title="Click to Unsubscribe" class="btn-floating btn-large red pulse btnhapusfavliga" id="lx${dataliga.id}">
                                <img class="imglove" src="../../assets/icons/delete.svg" alt=""/>
                            </a>
                        </div>
                        <h6 class="teal-text text-titlefav"><b>${dataliga.area.name}</b><br></h6>
                        <img class="imgavafav" src="assets/images/${dataliga.id}.png" alt="${dataliga.name}"/><br>
                        <span class="teal-text">
                            <b>Current Session</b><br>
                            <span class="currmatch" id="c${dataliga.currentSeason.currentMatchday}">${dataliga.currentSeason.currentMatchday}</span> Matches<br>
                            ${Utils.strtoDate(dataliga.currentSeason.startDate)} - ${Utils.strtoDate(dataliga.currentSeason.endDate)}
                        </span>
                    </div>`;
    });

    if (dataligas.length > 0) {
        document.getElementById('boxfavleague').innerHTML = profilHtml;

        Utils.getDetil('btndetilkompetisi', leagueDetil.loadLeagueDetil);

        inDB.hapusFavourite('btnhapusfavliga', 'Liga');

        console.log('Sukses Mengambil Data Liga Favorite dari IndexedDB');
    }
};

const loadMyPage = () => {
    // 1. Load Page Skeleton
    SumberData.ambilKonten('../pages/mypages.html', 'body-content')
        .then(() => {
            // 2a. Get Favorite League Data From IndexDB
            inDB.ambilIndexDB('Liga')
                .then((dataligas) => writeLeagueProfilHtml(dataligas))
                .catch((error) => Utils.loadError(error));

            // 2b. Get Favorite Team Data From IndexDB
            inDB.ambilIndexDB('Klub')
                .then((dataclubs) => writeTeamProfilHtml(dataclubs))
                .catch((error) => Utils.loadError(error));

            // 2c. Get Favorite Team Data From IndexDB
            inDB.ambilIndexDB('Pemain')
                .then((dataplayers) => writePlayerProfilHtml(dataplayers))
                .catch((error) => Utils.loadError(error));

            // 2d. Get Favorite Match Data From IndexDB
            inDB.ambilIndexDB('Pertandingan')
                .then((datamatches) => writeMatchProfilHtml(datamatches))
                .catch((error) => Utils.loadError(error));
        });
};

export default loadMyPage;
