import { storageService } from './storage-service.js'

export const mapService = {
    getLocs,
    getPosition,
    createLocation,
    getLocationById,
    removeLocation,
    addPlace,
    geocodeSearch,

}

// createLocation('stav', 10, 15), createLocation('Idan', 122, 15)
var LOCS_KEY = 'KEY'
var locs = []
const API_KEY = 'AIzaSyDd9KipmgPk6pAvx9HUICBglcd27bt-KlU';


// createLocation('stav', 10, 15), createLocation('Idan', 122, 15)

function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(locs);
    });
}

function addPlace(pos, marker, isFromSearch) {
    debugger
    const name = prompt('what is the name of the place?');
    let location;
    if (isFromSearch) {
        location = createLocation(name, pos.lat, pos.lng, marker);
    } else {
        location = createLocation(name, pos.lat(), pos.lng(), marker)
    }
    locs.push(location)
    return Promise.resolve();
}

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function createLocation(name, lat, lng, marker = null) {
    return {
        id: makeId(),
        name,
        lat,
        lng,
        weather: null,
        createdAt: Date.now(),
        marker
    }
}

function makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}

function getLocationById(id) {
    return Promise.resolve(
        locs.find(location => {
            return location.id === id;
        }))
}

function removeLocation(id) {
    return new Promise((resolve, reject) => {

        const idx = locs.findIndex(location => {
            return location.id === id;
        })


        if (idx === -1) {
            console.log();
            return reject(`Id: ${id} Not found in data.`);
        }
        else {
            locs.splice(idx, 1);
            return resolve();
        }
    }
    )
}

function _saveLocsToStorage() {
    storageService.save(LOCS_KEY, locs)
}

function _loadLocsFromStorage() {
    return storageService.load(LOCS_KEY)
}


function geocodeSearch(location) {
    return new Promise((resolve) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                resolve(data.results[0].geometry.location);
            }
            )
    })
}