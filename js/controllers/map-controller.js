import { mapService } from '../services/map-service.js'

export const mapController = {
    initMap,
    addMarker,
    panTo,
    renderLocationTable,
    onSearchLocation,
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

            map.addListener('click', ev => {
                onAddPlace(ev.latLng);
            });
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
            <p>Created at: ${convertToHumanTime(location.createdAt)}</p>
            <button data-id="${location.id}">Go</button>
            <button data-id="${location.id}">Remove</button>
            </li>
            `
        });
        document.querySelector('.location-table ul').innerHTML = strHTML.join('');
    })
}

function convertToHumanTime(timestamp) {
    const d = new Date(timestamp);
    return `${d.getHours()}:${d.getMinutes()} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()})`;
}

function onAddPlace(latLng) {
    mapService.addPlace(latLng)


}

function onSearchLocation() {
    const location = document.querySelector('.search-bar input').value;
    mapService.geocodeSearch(location)
        .then(location => {
            console.log(location);
            panTo(location.lat, location.lng)
        })
        .catch((error) => console.log('search error:', error));
}