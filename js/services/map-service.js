// import { storageService } from './storage-service'

export const mapService = {
    getLocs,
    getPosition,
    createLocation,
    getLocationById,
    removeLocation,
    addPlace,
    getLoc
}

var LOCS_KEY = 'KEY'
// createLocation('stav', 10, 15), createLocation('Idan', 122, 15)
var gLocs = []

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs);
        }, 2000)
    });
}

function addPlace(pos, marker) {
    let name = prompt('what is the name of the place?')
    let location = createLocation(name, pos.lat(), pos.lng(), marker)
    gLocs.push(location)
    console.log("addPlace -> locs", gLocs)
    
    
     
}

export function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function createLocation(name, lat, lng, marker=null) {
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
        gLocs.find(location => {
            return location.id === id;
        }))
}

function removeLocation(id) {
    return new Promise((resolve, reject) => {

        const idx = gLocs.findIndex(location => {
            return location.id === id;
        })


        if (idx === -1) {
            console.log();
            return reject(`Id: ${id} Not found in data.`);
        }
        else {
            gLocs.splice(idx, 1);
            return resolve();
        }
    }
    )
}


function getLoc(id) {
    const loc = gLocs.find(location => {
        return location.id === id;
    })
    return loc
}

function _saveLocsToStorage() {
    storageService.saveToStorage(LOCS_KEY, gLocs)
}

function _loadLocsFromStorage() {
    return storageService.loadFromStorage(LOCS_KEY)
}