import { mapService } from '../services/map-service.js'

export const mapController = {
    initMap,
    addMarker,
    panTo,
    renderLocationTable,
}

var map;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            map = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    map.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDd9KipmgPk6pAvx9HUICBglcd27bt-KlU';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function renderLocationTable() {
    var strHTML;
    mapService.getLocs().then(locations => {
        strHTML = locations.map(location => {
            return `
            <li>
            <h4>${location.name}</h4>
            <p>Created at: </p>
            <button data-id="${location.id}">Go</button>
            <button data-id="${location.id}">Remove</button>
            </li>
            `
        });
        document.querySelector('.location-table ul').innerHTML = strHTML.join('');
    })
}

function convertToHumanTime(timestamp) {
    console.log(timestamp);
    return `${timestamp.getHours()}`
    // :${timestamp.getMinutes()} ${timestamp.getDate()}/${timestamp.getMonth() + 1}/${timestamp.getFullYear()})`;
}