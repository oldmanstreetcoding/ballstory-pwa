/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable import/extensions */
import SumberData from '../data.js';
import Utils from '../utils.js';
import loadLeagueDetil from './leaguedetil.js';
import loadPlayerDetil from './playerdetil.js';
import loadMatchDetil from './matchdetil.js';
import inDB from '../indb.js';

const writeTeamInfoHtml = (data, info) => {
    let infoHtml = '';

    if (info === 'matches') {
        data.matches.map((match, index) => {
            let strvs = '';
            if (match.status === 'FINISHED' || match.status === 'AWARDED') {
                strvs = `FT<br>${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`;
            } else if (match.status === 'IN_PLAY') {
                strvs = `LIVE<br>${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`;
            } else {
                strvs = `NEXT<br><span class="hide-on-med-and-up">${Utils.strtoDate(match.utcDate.substring(0, 10))}</span>`;
            }

            let divstrip = '';

            if (index % 2 === 0) {
                divstrip = 'teal lighten-5';
            }

            const dtglmatch = match.utcDate.split('T');

            infoHtml += `
                        <ul id="tx${match.id}" class="collapsible popout">
                            <li>
                                <div title="Klik untuk menampilkan detil pertandingan" class="row collapsible-header ${divstrip} card-panel card-border">
                                    <div class="col m2 center-align hide-on-small-only">
                                        ${Utils.strtoDate(dtglmatch[0])}<br>${dtglmatch[1].replace('Z', '')}
                                    </div>
                                    <div class="col m2 right-align red-text hide-on-small-only btndetilteam" id="mx${match.homeTeam.id}">
                                        ${match.homeTeam.name}
                                    </div>
                                    <div class="col s5 m1 center-align btndetilteam" id="gx${match.homeTeam.id}" title="${match.homeTeam.name}">
                                        <img src="https://crests.football-data.org/${match.homeTeam.id}.svg" width="35px" alt=""/>
                                        <small class="hide-on-med-and-up"><br>${match.homeTeam.name}</small>
                                    </div>
                                    <div class="col s4 m2 center-align">${strvs}</div>
                                    <div class="col s5 m1 center-align btndetilteam" id="gx${match.awayTeam.id}" title="${match.awayTeam.name}">
                                        <img src="https://crests.football-data.org/${match.awayTeam.id}.svg" width="35px" alt=""/>
                                        <small class="hide-on-med-and-up"><br>${match.awayTeam.name}</small>
                                    </div>
                                    <div class="col m2 left-align red-text hide-on-small-only btndetilteam" id="mx${match.awayTeam.id}">
                                        ${match.awayTeam.name}
                                    </div>
                                    <div class="col m2 center-align hide-on-small-only">Match ${match.matchday == null ? '' : match.matchday}<br>${match.competition.name}</div>
                                </div>
                                <div class="collapsible-body center-align" id="c${match.id}">
                                    <h6 class="teal-text">... Loading ...</h6>
                                </div>
                            </li>
                        </ul>`;
        });
    } else {
        let squad = '';

        data.squad.map((sq) => {
            const dtgl = sq.dateOfBirth.split('T');
            squad += `<tr>
                <td>
                    <span class="teal-text btndetilpemain" id="ix${sq.id}">${sq.name}</span><br>
                    <small class="hide-on-med-and-up">
                        ${Utils.strtoDate(dtgl[0])} (${Utils.calculateAge(dtgl[0])})<br>
                        ${sq.nationality}
                    </small>
                </td>
                <td class="hide-on-small-only">
                    ${Utils.strtoDate(dtgl[0])} (${Utils.calculateAge(dtgl[0])})
                </td>
                <td class="hide-on-small-only">
                    ${sq.nationality}
                </td>
                <td>
                    ${sq.position == null ? '-' : sq.position}
                    <small class="hide-on-med-and-up">
                        ${Utils.stringToProper(sq.role)}
                    </small>
                </td>
                <td class="hide-on-small-only">
                    ${Utils.stringToProper(sq.role)}
                </td>
            </tr>`;
        });

        infoHtml += `<table class="card-panel centered striped table-bordered">
            <thead>
                <tr class="teal white-text">
                    <th>Name</th>
                    <th class="hide-on-small-only">DoB</th>
                    <th class="hide-on-small-only">Nationality</th>
                    <th>Position</th>
                    <th class="hide-on-small-only">Role</th>
                </tr>
            </thead>
            <tbody>
                ${squad}
            </tbody>
        </table>`;
    }

    document.getElementById('boxsubprofildetil').innerHTML = infoHtml;

    if (info === 'matches') {
        Utils.divCollapse('.collapsible.popout');

        Utils.getDetil('collapsible', loadMatchDetil);

        Utils.getDetil('btndetilteam', loadTeamDetil, true);
    } else {
        Utils.getDetil('btndetilpemain', loadPlayerDetil);
    }
};

const getTeamInfoData = (idteam, info) => {
    // 1. Cek API info Team yang ingin ditampilkan
    let api = '';
    if (info === 'matches') {
        api = `/v2/teams/${idteam}/matches/`;
    } else {
        api = `/v2/teams/${idteam}`;
    }

    // 2. Show Horizontal Loader
    Utils.horizonLoader('block');

    // 3. Get Data From Cache
    if ('caches' in window) {
        SumberData.ambilCache(api)
            // 4. Fill Page With Team Info
            .then((data) => writeTeamInfoHtml(data, info))
            // 5. Or Show Error
            .catch((error) => Utils.loadError(error))
            // 6. Finally Just Close Horizon PreLoader
            .finally(() => Utils.horizonLoader('none'));
    }

    // 7. Get Team Info From API
    SumberData.ambilData(api)
        // 8. Fill Page With Team Info
        .then((data) => writeTeamInfoHtml(data, info))
        // 9. Or Show Error
        .catch((error) => Utils.loadError(error))
        // 10. Finally Just Close Horizon PreLoader
        .finally(() => Utils.horizonLoader('none'));
};

const writeTeamProfilHtml = (teams) => {
    let activecomp = '<ul class="collection">';
    teams.activeCompetitions.map((team) => {
        let btnliga = '';
        if (Utils.idLiga.indexOf(team.id) >= 0) {
            btnliga = 'btndetilkompetisi';
        } else {
            btnliga = '';
        }
        activecomp += `<li class="teal-text collection-item ${btnliga}" id="tx${team.id}">${team.name}</li>`;
    });

    activecomp += '</ul>';

    let situsklub = '';
    if (teams.website !== null) {
        situsklub = `<a href="${teams.website}" target="_blank">${teams.website}</a>`;
    }

    const profilHtml = `<div class="card-panel card-border center-align" id="boxavatar">
                            <h5 class="teal-text"><b>${teams.name}</b></h5>
                            <img id="imgavaliga" class="" src="${teams.crestUrl}" alt="${teams.name}"/>
                            <div>
                                <a title="Subscribe Info Terupdate Team" class="btn-floating btn-large teal pulse favclass" id="dxKlub">
                                    <img class="imglove" src="../../assets/icons/heart.svg" alt=""/>
                                </a>
                            </div>
                            <p>
                                <small>
                                    ${teams.venue}<br>
                                    ${teams.address}<br>
                                    ${teams.phone}<br>
                                    ${teams.email}<br>
                                    ${situsklub}
                                </small>
                                ${activecomp}
                            </p>
                        </div>`;

    document.getElementById('boxprofil').innerHTML = profilHtml;

    Utils.getDetil('btndetilkompetisi', loadLeagueDetil);

    inDB.saveMyFavorite('favclass', teams);
};

const loadTeamDetil = (idteam) => {
    // 1. Load Page Skeleton
    SumberData.ambilKonten('../pages/templates/teampage.html', 'boxmodal')
        .then(() => {
            // 2. Show Horizon PreLoader
            Utils.horizonLoader('block');

            // 3. Get Data From Cache
            if ('caches' in window) {
                SumberData.ambilCache(`/v2/teams/${idteam}`)
                    // 4. Fill Page With Team Profil
                    .then((team) => writeTeamProfilHtml(team))
                    // 5. Or Show Error
                    .catch((error) => Utils.loadError(error));
            }

            // 6. Get Team Profil From API
            SumberData.ambilData(`/v2/teams/${idteam}`)
                // 7. Fill Page With Team Profil
                .then((team) => writeTeamProfilHtml(team))
                // 8. Or Show Error
                .catch((error) => Utils.loadError(error));

            // 9. Load Info Pertandingan Team
            getTeamInfoData(idteam, 'matches');
        })
        .then(() => {
            // 10. Event Listener Tab Info Team
            const btn = document.getElementsByClassName('tab');
            for (let i = 0; i < btn.length; i++) {
                btn[i].addEventListener('click', () => {
                    getTeamInfoData(idteam, btn[i].id);
                });
            }

            Utils.closeModal();
        });
};

const clubDetil = {
    loadTeamDetil,
    writeTeamInfoHtml,
};

export default clubDetil;
