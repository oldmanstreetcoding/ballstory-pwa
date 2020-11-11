/* eslint-disable import/no-cycle */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import SumberData from '../data.js';
import Utils from '../utils.js';
import inDB from '../indb.js';

// Tulis ata detil pertandingan
const writeMatchInfoHtml = (match, idmatch) => {
    const writeHtml = (data, cekexist) => {
        const dtglmatch = data.match.utcDate.split('T');

        let refere = '';
        data.match.referees.map((ref, index) => {
            refere += `${index + 1}. ${ref.name} `;
            return index;
        });

        let h2h = '0 Matches / 0 Goals';
        let hwin = 0;
        let hdraw = 0;
        let hloss = 0;
        let awin = 0;
        let adraw = 0;
        let aloss = 0;
        if (data.head2head !== null) {
            h2h = `${data.head2head.numberOfMatches} Matches / ${data.head2head.totalGoals} Goals`;
            hwin = data.head2head.homeTeam.wins;
            hdraw = data.head2head.homeTeam.draws;
            hloss = data.head2head.homeTeam.losses;
            awin = data.head2head.awayTeam.wins;
            adraw = data.head2head.awayTeam.draws;
            aloss = data.head2head.awayTeam.losses;
        }

        let btnfav = '';
        if (cekexist > 0) {
            btnfav = `<a title="Click to Unsubscribe" class="btn-floating btn-large red pulse btnhapusfavmatch" id="sx${data.id}">
                        <img class="imglove" src="../../assets/icons/delete.svg" alt=""/>
                    </a>`;
        } else {
            btnfav = `<a title="Subscribe For Latest Match Info" class="btn-floating btn-large teal pulse favclass" id="dxPertandingan">
                        <img class="imglove" src="../../assets/icons/heart.svg" alt=""/>
                    </a>`;
        }

        const infoMatchHtml = `<table class="card-panel centered striped table-bordered" id="tblh2h">
                                <thead>
                                    <tr>
                                        <th colspan="3">
                                            ${btnfav}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colspan="3"><h6 class="teal-text"><b>Head To Head</b></h6></th>
                                    </tr>
                                    <tr>
                                        <th colspan="3">${h2h}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td width="47%" class="right-align">${hwin}</td>
                                        <td width="6%" class="center-align">Menang</td>
                                        <td width="47%" class="left-align">${awin}</td>
                                    </tr>
                                    <tr>
                                        <td class="right-align">${hdraw}</td>
                                        <td class="center-align">Seri</td>
                                        <td class="left-align">${adraw}</td>
                                    </tr>
                                    <tr>
                                        <td class="right-align">${hloss}</td>
                                        <td class="center-align">Kalah</td>
                                        <td class="left-align">${aloss}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="card-panel centered striped table-bordered">
                                <thead>
                                    <tr>
                                        <th colspan="3"><h6 class="teal-text"><b>Result</b></h6></th>
                                    </tr>
                                    <tr>
                                        <th colspan="3">${data.match.venue}<br>${Utils.strtoDate(dtglmatch[0])} ${dtglmatch[1].replace('Z', '')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td width="46%" class="right-align">${data.match.score.halfTime.homeTeam == null ? '-' : data.match.score.halfTime.homeTeam}</td>
                                        <td width="8%" class="center-align">Half Time</td>
                                        <td width="46%" class="left-align">${data.match.score.halfTime.awayTeam == null ? '-' : data.match.score.halfTime.awayTeam}</td>
                                    </tr>
                                    <tr>
                                        <td class="right-align">${data.match.score.fullTime.homeTeam == null ? '-' : data.match.score.fullTime.homeTeam}</td>
                                        <td class="center-align">Full Time</td>
                                        <td class="left-align">${data.match.score.fullTime.awayTeam == null ? '-' : data.match.score.fullTime.awayTeam}</td>
                                    </tr>
                                </tbody>
                                <thead>
                                    <tr>
                                        <th colspan="3">Referees : <br>${refere}</th>
                                    </tr>
                                </thead>
                            </table>`;

        document.getElementById(`c${idmatch}`).innerHTML = infoMatchHtml;

        if (cekexist > 0) {
            inDB.hapusFavourite('btnhapusfavmatch', 'Pertandingan');
        } else {
            inDB.saveMyFavorite('favclass', data);
        }
    };

    // Sandingkan data indexedDB dan data API untuk menentukan tombol favorite
    inDB.ambilIndexDB('Pertandingan')
        .then((datamatches) => writeHtml(match, inDB.indbVsApi(datamatches, match.match)));
};

const loadMatchDetil = (idmatch) => {
    // 1. Show Horizon PreLoader
    Utils.horizonLoader('block');

    // 2. Get Data From Cache
    if ('caches' in window) {
        SumberData.ambilCache(`/v2/matches/${idmatch}`)
            // 3. Fill Page With Match Info
            .then((data) => writeMatchInfoHtml(data, idmatch))
            // 4. Or Show Error
            .catch((error) => Utils.loadError(error))
            // 5. Finally Just Close Horizon PreLoader
            .finally(() => Utils.horizonLoader('none'));
    }

    // 6. Get Match Info From API
    SumberData.ambilData(`/v2/matches/${idmatch}`)
        // 7. Fill Page With Match Info
        .then((data) => writeMatchInfoHtml(data, idmatch))
        // 8. Or Show Error
        .catch((error) => Utils.loadError(error))
        // 9. Finally Just Close Horizon PreLoader
        .finally(() => Utils.horizonLoader('none'));
};

export default loadMatchDetil;
