export const locService = {
    getLocs,
    getPosition,
    createLocation,
}

var locs = [createLocation('stav', 10, 15), createLocation('Idan', 122, 15)]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function getPosition() {
    console.log('Getting Pos');

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}



function createLocation(name, lat, lng) {
    return {
        id: makeId(),
        name,
        lat,
        lng,
        weather: null,
        createdAt: Date.now()
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
