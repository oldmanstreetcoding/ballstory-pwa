/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
import SumberData from './data.js';
import Utils from './utils.js';
import leagueDetil from './component/leaguedetil.js';

// tampilkan chard list liga di bawah mapchart
const writeLeagueHtml = (leaguedatas = []) => {
    const ligapilihan = [];

    leaguedatas.competitions.map((data) => {
        if (Utils.idLiga.indexOf(data.id) >= 0) {
            ligapilihan.push(data);
        }
        return ligapilihan;
    });

    let listliga = '';
    if (ligapilihan.length === 0) {
        listliga = '<p class="red-text text-darken-1 center-align">Data List Kompetisi Tidak Dapat Ditampilkan</p>';
    } else {
        const pecahliga = Utils.chunkArray(ligapilihan, 2);

        listliga = `<div class="col s12 l6">
                            <div class="row">`;

        pecahliga[0].map((ligaA) => {
            listliga += `<div class="col s6 m3 modal-trigger btn-bs btndetilkompetisia" id="wx${ligaA.id}" data-target="boxmodal">
                            <div class="card-panel card-border teal lighten-5 boxspark boxliga">
                                <img class="imgliga" src="assets/images/${ligaA.id}.png" alt="${ligaA.name}"/>
                                <p>${ligaA.area.name}</p>
                            </div>
                        </div>`;
        });

        listliga += `</div>
                        </div>
                    <div class="col s12 l6">
                        <div class="row">`;

        pecahliga[1].map((ligaB) => {
            listliga += `<div class="col s6 m3 modal-trigger btn-bs btndetilkompetisia" id="wx${ligaB.id}" data-target="boxmodal">
                            <div class="card-panel card-border teal lighten-5 boxspark boxliga">
                                <img class="imgliga" src="assets/images/${ligaB.id}.png" alt="${ligaB.name}"/>
                                <p>${ligaB.area.name}</p>
                            </div>
                        </div>`;
        });

        listliga += `</div>
                        </div>`;
    }

    document.getElementById('boxlistliga').innerHTML = listliga;

    Utils.getDetil('btndetilkompetisia', leagueDetil.loadLeagueDetil);
};

// Buat MapChart menggunakan library amChart
const loadMapChart = () => {
    const chart = am4core.create('chartdiv', am4maps.MapChart);
    chart.geodata = am4geodata_region_world_europeHigh;
    chart.projection = new am4maps.projections.Miller();

    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.fill = am4core.color('#74B266');

    polygonSeries.mapPolygons.template.events.on('hit', (ev) => {
        chart.zoomToMapObject(ev.target);
    });

    chart.homeZoomLevel = 2;
    chart.homeGeoPoint = { longitude: 10, latitude: 51 };

    chart.zoomControl = new am4maps.ZoomControl();

    const homeButton = new am4core.Button();
    homeButton.events.on('hit', () => {
        chart.goHome();
    });

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path = 'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);

    chart.smallMap = new am4maps.SmallMap();
    chart.smallMap.series.push(polygonSeries);
    chart.smallMap.align = 'left';
    chart.smallMap.background.fillOpacity = 0.5;

    const imageSeries = chart.series.push(new am4maps.MapImageSeries());
    const imageTemplate = imageSeries.mapImages.template;
    imageTemplate.propertyFields.longitude = 'longitude';
    imageTemplate.propertyFields.latitude = 'latitude';
    imageTemplate.nonScaling = true;

    const pin = imageTemplate.createChild(am4plugins_bullets.PinBullet);

    pin.events.on('hit', (event) => {
        const pilihliga = event.target._dataItem._dataContext.title;
        leagueDetil.loadLeagueDetil(Utils.refLiga[pilihliga].id, 'pin');
    });

    pin.tooltipText = '{title}';
    imageSeries.tooltip.pointerOrientation = 'left';

    pin.background.fill = chart.colors.getIndex(0);
    pin.background.fillOpacity = 0.7;
    pin.background.pointerAngle = 90;
    pin.background.pointerBaseWidth = 10;
    pin.background.pointerLength = 20;

    pin.image = new am4core.Image();
    pin.image.propertyFields.href = 'imageURL';

    imageSeries.heatRules.push({
        target: pin.background,
        property: 'radius',
        min: 20,
        max: 40,
        dataField: 'value',
    });

    const circle = pin.createChild(am4core.Ellipse);
    circle.radius = 6;
    circle.radiusY = 3;
    circle.strokeWidth = 0;
    circle.fillOpacity = 0.3;
    circle.zIndex = -1;

    const hs = pin.background.states.create('hover');
    hs.properties.radius = 50;

    imageSeries.data = Utils.geoLocLiga;

    am4core.options.autoDispose = true;
};

const loadLeaguePage = () => {
    // 1. Load Page Skeleton
    SumberData.ambilKonten('../pages/leagues.html', 'body-content')
        .then(() => {
            // 2. Show Circle PreLoader Before Fill Page
            Utils.circleLoader('block');
            // 3. Fill Page With Stated MapChart
            loadMapChart();

            // 4. Get Data From Cache
            if ('caches' in window) {
                SumberData.ambilCache('/v2/competitions?plan=TIER_ONE')
                    // 5. Fill Page With League List
                    .then((leaguedatas) => writeLeagueHtml(leaguedatas))
                    // 6. Or Show Error
                    .catch((error) => Utils.loadError(error))
                    // 7. Finally Both of Cases Just Close Circle PreLoader
                    .finally(() => Utils.circleLoader('none'));
            }

            // 8. Get League List Data From API
            SumberData.ambilData('/v2/competitions?plan=TIER_ONE')
                // 9. Fill Page With League List
                .then((leaguedatas) => writeLeagueHtml(leaguedatas))
                // 10. Or Show Error
                .catch((error) => Utils.loadError(error))
                // 11. Finally Both of Cases Just Close Circle PreLoader
                .finally(() => Utils.circleLoader('none'));
        });
};

export default loadLeaguePage;
