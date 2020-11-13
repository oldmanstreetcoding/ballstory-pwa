/* eslint-disable array-callback-return */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable radix */
/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
import SumberData from '../data.js';
import Utils from '../utils.js';
import playerDetil from './playerdetil.js';
import clubDetil from './clubdetil.js';
import loadMatchDetil from './matchdetil.js';
import inDB from '../indb.js';

const writeLeagueInfoHtml = (data, info, id, idmatch = null) => {
    let infoHtml = '';

    if (info === 'scorers') {
        infoHtml += `<table class="centered striped table-bordered">
                            <thead>
                                <tr class="teal white-text">
                                    <th>Players</th>
                                    <th class="hide-on-small-only">Nationality</th>
                                    <th class="hide-on-small-only">Club</th>
                                    <th>Position</th>
                                    <th>Goals</th>
                                </tr>
                            </thead>
                            <tbody>`;

        data.scorers.map((pemain) => {
            infoHtml += `<tr>
                            <td><h6 class="teal-text btndetilpemaina btn-bs" id="sx${pemain.player.id}">${pemain.player.name}</h6><small class="btndetilteama btn-bs hide-on-med-and-up teal-text" id="sx${pemain.team.id}">${pemain.player.nationality} / ${pemain.team.name}</small></td>
                            <td class="hide-on-small-only">
                                ${pemain.player.nationality}
                            </td>
                            <td class="btndetilteama btn-bs hide-on-small-only teal-text" id="sx${pemain.team.id}">
                                ${pemain.team.name}
                            </td>
                            <td>
                                <i>${pemain.player.position}</i>
                            </td>
                            <td>
                                ${pemain.numberOfGoals}
                            </td>
                        </tr>`;
        });

        infoHtml += `</tbody>
                    </table>`;
    } else if (info === 'matches') {
        if (idmatch === null) {
            idmatch = data.matches[0].season.currentMatchday.tonu;
        }

        let prevmatch = null;
        if (idmatch === 1) {
            prevmatch = idmatch;
        } else {
            prevmatch = idmatch - 1;
        }

        const nextmatch = parseInt(idmatch) + 1;

        infoHtml += `
                    <div class="row">
                        <div class="col s3 btnothermatch teal-text" id="px${prevmatch}"><< <span class="hide-on-small-only">Prev Matches</span></div>
                        <div class="col s6"><b>Matchday ${idmatch}</b></div>
                        <div class="col s3 btnothermatch teal-text" id="nx${nextmatch}"><span class="hide-on-small-only">Next Matches</span> >></div>
                    </div>
                `;

        data.matches.map((match, index) => {
            let strvs = '';
            if (match.status === 'FINISHED' || match.status === 'AWARDED') {
                strvs = `FT<br>${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}<br>
                <small class="hide-on-med-and-up">${Utils.strtoDate(match.utcDate.substring(0, 10))}</small>`;
            } else if (match.status === 'IN_PLAY') {
                strvs = `LIVE<br>${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}<br>
                <small class="hide-on-med-and-up">${Utils.strtoDate(match.utcDate.substring(0, 10))}</small>`;
            } else {
                strvs = `NEXT<br>
                <small class="hide-on-med-and-up">${Utils.strtoDate(match.utcDate.substring(0, 10))}</small>
                `;
            }

            let divstrip = '';

            if (index % 2 === 0) {
                if (match.matchday < match.season.currentMatchday) {
                    divstrip = 'grey darken-1 white-text';
                } else if (match.matchday > match.season.currentMatchday) {
                    divstrip = 'pink lighten-5';
                } else {
                    divstrip = 'teal lighten-5';
                }
            }

            const dtglmatch = match.utcDate.split('T');

            infoHtml += `
                        <ul id="lx${match.id}" class="collapsible popout btndetilmatcha">
                            <li>
                                <div title="Klik untuk menampilkan detil pertandingan" class="row ${divstrip} collapsible-header card-panel card-border">
                                    <div class="col m2 center-align hide-on-small-only">${Utils.strtoDate(dtglmatch[0])}<br>${dtglmatch[1].replace('Z', '')}</div>
                                    <div class="col m2 right-align hide-on-small-only red-text btndetilteama btn-bs" id="mx${match.homeTeam.id}">${match.homeTeam.name}</div>
                                    <div class="col s5 m2 center-align btndetilteama btn-bs" id="gx${match.homeTeam.id}" title="${match.homeTeam.name}">
                                        <img src="https://crests.football-data.org/${match.homeTeam.id}.svg" width="35px" alt=""/>
                                        <small class="hide-on-med-and-up"><br>${match.homeTeam.name}</small>
                                    </div>
                                    <div class="col s4 m2 center-align">${strvs}</div>
                                    <div class="col s5 m2 center-align btndetilteama btn-bs" id="gx${match.awayTeam.id}" title="${match.awayTeam.name}">
                                        <img src="https://crests.football-data.org/${match.awayTeam.id}.svg" width="35px" alt=""/>
                                        <small class="hide-on-med-and-up"><br>${match.awayTeam.name}</small>
                                    </div>
                                    <div class="col m2 left-align hide-on-small-only red-text btndetilteama btn-bs" id="mx${match.awayTeam.id}">${match.awayTeam.name}</div>
                                </div>
                                <div class="collapsible-body center-align" id="c${match.id}">
                                    <h6 class="red-text">... Loading ...</h6>
                                </div>
                            </li>
                        </ul>`;
        });
    } else if (parseInt(id) !== 2001) {
        infoHtml += `<table class="centered striped table-bordered">
                            <thead>
                                <tr class="teal white-text">
                                    <th>#</th>
                                    <th colspan="2">Klub</th>
                                    <th>P</th>
                                    <th>M</th>
                                    <th>S</th>
                                    <th>K</th>
                                    <th class="hide-on-small-only">GM</th>
                                    <th class="hide-on-small-only">GA</th>
                                    <th>SG</th>
                                    <th>Poin</th>
                                    <th>Pertandingan Terakhir</th>
                                </tr>
                            </thead>
                            <tbody>`;

        data.standings[0].table.map((club) => {
            infoHtml += `<tr>
                                <td>${club.position}</td>
                                <td width="60px" class="btndetilteama btn-bs" id="px${club.team.id}" title="${club.team.name}">
                                    <img src="${club.team.crestUrl}" width="30px" alt=""/>
                                    <small class="hide-on-med-and-up"><br>${club.team.name}</small>
                                </td>
                                <td class="btndetilteama btn-bs" id="tx${club.team.id}"><span class="hide-on-small-only teal-text">${club.team.name}</span></td>
                                <td>${club.playedGames}</td>
                                <td>${club.won}</td>
                                <td>${club.draw}</td>
                                <td>${club.lost}</td>
                                <td class="hide-on-small-only">${club.goalsFor}</td>
                                <td class="hide-on-small-only">${club.goalsAgainst}</td>
                                <td>${club.goalDifference}</td>
                                <td>${club.points}</td>
                                <td>${Utils.fiveLastMatch(club.form)}</td>
                            </tr>`;
        });

        infoHtml += `</tbody>
                    </table>`;
    } else {
        infoHtml = '<h6><b>GROUP STAGE</b></h6>';

        data.standings.map((grup) => {
            infoHtml += `<p class="center-align teal-text">${grup.group}</p>
                            <table class="centered striped tblLiga table-bordered">
                                <thead>
                                    <tr class="teal white-text">
                                        <th colspan="3">Klub</th>
                                        <th>P</th>
                                        <th>M</th>
                                        <th>S</th>
                                        <th>K</th>
                                        <th class="hide-on-small-only">GM</th>
                                        <th class="hide-on-small-only">GA</th>
                                        <th>SG</th>
                                        <th>Poin</th>
                                        <th>Pertandingan Terakhir</th>
                                    </tr>
                                </thead>
                            <tbody>`;

            grup.table.map((club) => {
                infoHtml += `<tr>
                                    <td>${club.position}</td>
                                    <td class="btndetilteama btn-bs" id="lx${club.team.id}" title="${club.team.name}">
                                        <img src="${club.team.crestUrl}" width="30px" alt=""/>
                                        <small class="hide-on-med-and-up"><br>${club.team.name}</small>
                                    </td>
                                    <td class="btndetilteama btn-bs" id="cx${club.team.id}"><span class="hide-on-small-only teal-text">${club.team.name}</span></td>
                                    <td>${club.playedGames}</td>
                                    <td>${club.won}</td>
                                    <td>${club.draw}</td>
                                    <td>${club.lost}</td>
                                    <td class="hide-on-small-only">${club.goalsFor}</td>
                                    <td class="hide-on-small-only">${club.goalsAgainst}</td>
                                    <td>${club.goalDifference}</td>
                                    <td>${club.points}</td>
                                    <td>${Utils.fiveLastMatch(club.form)}</td>
                                </tr>`;
            });

            infoHtml += `</tbody>
                    </table>`;
        });
    }

    infoHtml += `<p class="right-align red-text">Update Terakhir: ${Utils.strtoDate(data.competition.lastUpdated.substring(0, 10))}</p>`;

    document.getElementById('boxsubprofildetil').innerHTML = infoHtml;

    if (info === 'matches') {
        Utils.divCollapse('.collapsible.popout');

        Utils.getDetil('btndetilmatcha', loadMatchDetil);

        const btnmatch = document.getElementsByClassName('btnothermatch');
        for (let i = 0; i < btnmatch.length; i++) {
            btnmatch[i].addEventListener('click', () => {
                getLeagueInfoData(id, 'matches', btnmatch[i].id.split('x')[1]);
            });
        }
    } else if (info === 'scorers') {
        Utils.getDetil('btndetilpemaina', playerDetil.loadPlayerDetil);
    }

    Utils.getDetil('btndetilteama', clubDetil.loadTeamDetil, true);
};

const getLeagueInfoData = (id, info = '', idmatch = null) => {
    // 1. Cek API info liga yang ingin ditampilkan
    let api;
    if (info === 'scorers') {
        api = `/v2/competitions/${id}/${info}`;
    } else if (info === 'matches') {
        api = `/v2/competitions/${id}/${info}?matchday=${idmatch}`;
    } else {
        api = `/v2/competitions/${id}/${info}?standingType=TOTAL`;
    }

    // 2. Show Horizon PreLoader
    Utils.horizonLoader('block');

    // 3. Get Data From Cache
    if ('caches' in window) {
        SumberData.ambilCache(api)
            // 4. Fill Page With Profil League
            .then((data) => writeLeagueInfoHtml(data, info, id, idmatch))
            // 5. Or Show Error
            .catch((error) => Utils.loadError(error))
            // 6. Finally Just Close Horizon PreLoader
            .finally(() => Utils.horizonLoader('none'));
    }

    // 7. Get League Info From API
    SumberData.ambilData(api)
        // 8. Fill Page With League Info
        .then((data) => writeLeagueInfoHtml(data, info, id, idmatch))
        // 9. Or Show Error
        .catch((error) => Utils.loadError(error))
        // 10. Finally Just Close Horizon PreLoader
        .finally(() => Utils.horizonLoader('none'));
};

const writeLeagueProfilHtml = (profil) => {
    const writeHtml = (data, cekexist) => {
        let btnfav = '';
        if (cekexist > 0) {
            btnfav = `<a title="Unsubscribe Info Terupdate Liga" class="btn-floating btn-large red pulse favclass btnhapusfavligac" id="lx${data.id}">
                        <img class="imglove" src="../../assets/icons/delete.svg" alt=""/>
                    </a>`;
        } else {
            btnfav = `<a title="Subscribe Info Terupdate Liga" class="btn-floating btn-large teal pulse favclass" id="dxLiga">
                        <img class="imglove" src="../../assets/icons/heart.svg" alt=""/>
                    </a>`;
        }

        const profilHtml = `<div class="card-panel card-border center-align" id="boxavatar">
                            <h5 class="teal-text"><b>${data.area.name}</b></h5>
                            <img id="imgavaliga" class="" src="assets/images/${data.id}.png" alt="${data.name}"/>
                            <div>
                            ${btnfav}
                            </div>
                                <p class="teal-text">
                                    <b>Current Session</b><br>
                                    <span class="currmatch" id="c${data.currentSeason.currentMatchday}">${data.currentSeason.currentMatchday}</span> Matches<br>
                                    ${Utils.strtoDate(data.currentSeason.startDate)} - ${Utils.strtoDate(data.currentSeason.endDate)}
                                </p>
                            </div>`;

        document.getElementById('boxprofil').innerHTML = profilHtml;

        if (cekexist > 0) {
            inDB.hapusFavourite('btnhapusfavligac', 'Liga');
        } else {
            inDB.saveMyFavorite('favclass', data);
        }
    };

    // Sandingkan data indexedDB dan data API untuk menentukan tombol favorite
    inDB.ambilIndexDB('Liga')
        .then((dataligas) => writeHtml(profil, inDB.indbVsApi(dataligas, profil)));
};

const loadLeagueDetil = (idleague, typeclick = '') => {
    // 1. Show Modal
    if (typeclick === 'pin') {
        Utils.getModal().open();
    }

    // 2. Load Page Skeleton
    SumberData.ambilKonten('../pages/templates/leaguepage.html', 'boxmodal')
        .then(() => {
            // 3. Show Horizon PreLoader
            Utils.horizonLoader('block');

            // 4. Get Data From Cache
            if ('caches' in window) {
                SumberData.ambilCache(`/v2/competitions/${idleague}`)
                    // 5. Fill Page With Profil League
                    .then((profil) => writeLeagueProfilHtml(profil))
                    // 6. Or Show Error
                    .catch((error) => Utils.loadError(error));
            }

            // 7. Get League Profil From API
            SumberData.ambilData(`/v2/competitions/${idleague}`)
                // 8. Fill Page With Profil League
                .then((profil) => writeLeagueProfilHtml(profil))
                // 9. Or Show Error
                .catch((error) => Utils.loadError(error));

            // 10. Load Info Klasemen Liga
            getLeagueInfoData(idleague, 'standings');
        })
        .then(() => {
            // 11. Event Listener Tab Info Liga
            const btn = document.getElementsByClassName('tab');
            for (let i = 0; i < btn.length; i++) {
                btn[i].addEventListener('click', () => {
                    getLeagueInfoData(idleague, btn[i].id, document.getElementsByClassName('currmatch')[0].id.split('c')[1]);
                });
            }

            Utils.closeModal();
        });
};

const leagueDetil = {
    loadLeagueDetil,
    writeLeagueProfilHtml,
};

export default leagueDetil;
