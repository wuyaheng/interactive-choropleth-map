// const CORS = "https://cors-anywhere.herokuapp.com/"
var token = 'pk.eyJ1Ijoic3RhcmR1c3QxOTEiLCJhIjoiY2thNjMzZzdlMDNtdTJ6bWptaTFqa3Y2MSJ9.VIX2KRmemtC5qDAMyL9Jug'

var geojson;
var map = L.map('map').setView([40.730610, -73.935242], 10);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + token, {
    id: 'mapbox/light-v9',
    attribution: 'hello',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

function getColor(d) {    
    if (d && d.indexOf(",") >= 0)
        d = d.split(",")[0].trim();

    switch (d) {
        case 'Sun':
            return '#800026'
        case 'Mon':
            return '#BD0026'
        case 'Tues':
            return '#E31A1C'
        case 'Wed':
            return '#FC4E2A'
        case 'Thurs':
            return '#FD8D3C'
        case 'Fri':
            return '#FEB24C'
        case 'Sat':
            return '#FED976'
        default:
            return '#FFEDA0'
    }
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}



const dataset = "https://data.cityofnewyork.us/resource/rv63-53db.json"
$.getJSON(dataset)
    .then(response => {
        console.log(response)

        const features = {
            type: "FeatureCOllection",
            features: response.map((x, i) => ({
                type: "Feature",
                id: i,
                properties: {
                    name: x.district,
                    density: x.freq_bulk
                },
                geometry: {
                    type: "Polygon",
                    coordinates: x.multipolygon.coordinates[0]
                }
            }))
        }

        geojson = L.geoJson(features, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => console.warn(error))