import { mapController } from './controllers/map-controller.js'
import { mapService } from './services/map-service.js'

// ONLOAD FUNCTION:
window.onload = () => {
    mapController.renderLocationTable();

    mapController.initMap()
        .then(() => {
            mapController.addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    addEventListeners()
}

function addEventListeners() {
    // EVENT FOR GETTING USER LOCATION
    document.querySelector('.my-location').addEventListener('click', () => {
        getPosition()
            .then((position) => {
                const { latitude, longitude } = position.coords;
                mapController.panTo(latitude, longitude);
            })
            .catch(err => {
                console.log('Cannot get user-position', err);
            })
    })

    // EVENTS FOR LOCATION BUTTONS
    document.querySelector('.location-table ul').onclick = (ev) => {

        if (ev.target.tagName === 'BUTTON') {
            var btn = ev.target;
            if (btn.innerText === 'Go') {
                mapService.getLocationById(btn.dataset.id)
                    .then((location) => {
                        mapController.panTo(location.lat, location.lng);
                    })
            }
            else if (btn.innerText === 'Remove') {
                mapService.removeLocation(btn.dataset.id)
                    .then(mapController.renderLocationTable())
                    .catch((error) => {
                        console.log('unable to delete location', error)
                    }
                    )
            }
        }
    }
}
