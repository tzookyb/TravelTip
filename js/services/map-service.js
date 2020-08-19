export const mapService = {
    getLocs,
    getPosition,
    createLocation,
    getLocationById,
    removeLocation,
    addPlace,
    geocodeSearch,
    
}

const API_KEY = 'AIzaSyDd9KipmgPk6pAvx9HUICBglcd27bt-KlU';
var locs = []

// createLocation('stav', 10, 15), createLocation('Idan', 122, 15)

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function addPlace(pos, marker) {
    let name = prompt('what is the name of the place?')
    let location = createLocation(name, pos.lat(), pos.lng(), marker)
    locs.push(location)
    console.log("addPlace -> locs", locs)
}

export function getPosition() {
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

function geocodeSearch(location) {
    return new Promise((resolve) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                resolve(data.results[0].geometry.location);
            }
            )
    })
}