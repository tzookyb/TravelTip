import { mapService } from '../services/map-service.js'

export const mapController = {
    initMap,
    addMarker,
    panTo,
    renderLocationTable,
    onSearchLocation,
    removeMarker,
    checkURLQuery,
    copyUrlToClipboard,
}

var map;
var currLocation;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            map = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 10
            })

            map.addListener('click', event => {
                let currMarker = addMarker(event.latLng);
                console.log("initMap -> event", event)
                onAddPlace(event.latLng, currMarker);
            })

            // map.addListener("click", event => {
            //     addMarker(event.latLng);
            // })


        })
}

function addMarker(loc) {

    var marker = new google.maps.Marker({
        position: loc,
        map: map,
    });
    return marker;
}

function panTo(lat, lng) {
    currLocation = { lat: lat, lng: lng };
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

function onAddPlace(latLng, marker, isFromSearch = false) {
    mapService.addPlace(latLng, marker, isFromSearch)
        .then(renderLocationTable());
    let location;
    if (isFromSearch) {
        location = { lat: latLng.lat, lng: latLng.lng };
    } else {
        location = { lat: latLng.lat(), lng: latLng.lng() }
    }
    panTo(location.lat, location.lng);
}

function onSearchLocation() {
    const location = document.querySelector('.search-bar input').value;
    mapService.geocodeSearch(location)
        .then(location => {
            panTo(location.lat, location.lng)
            return location;
        })
        .then((location) => {
            let currMarker = addMarker(location);
            onAddPlace(location, currMarker, true);
        })
        .catch((error) => console.log('search error:', error));
}

function removeMarker(id) {
    mapService.getLocationById(id)
        .then(currLoc => {
            currLoc.marker.setMap(null)
        });
}

function checkURLQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    if (lat && lng) {
        panTo(lat, lng);
    }
}

function copyUrlToClipboard() {
    const Url = `${window.location.href}?lat=${currLocation.lat}&lng=${currLocation.lng}`;
    const elem = document.createElement('textarea');
    elem.value = Url;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
}