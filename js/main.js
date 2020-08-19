import { mapController } from './controllers/map-controller.js'
import { getPosition } from './services/map-service.js'


// ONLOAD FUNCTION:
window.onload = () => {
    mapController.renderLocationTable();

    mapController.initMap()
        .then(() => {
            var mark = mapController.addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })

    addEventListeners()
}

function addEventListeners() {
    document.querySelector('.my-location').addEventListener('click', () => {
        getPosition()
            .then((position) => {
                const { latitude, longitude } = position.coords;
                mapController.panTo(latitude, longitude);
            })
            .catch(err => {
            })
    })
}