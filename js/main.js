import { mapController } from './controllers/map-controller.js'
import { mapService } from './services/map-service.js'


// ONLOAD FUNCTION:
window.onload = () => {
    mapController.renderLocationTable();
    document.execCommand('copy')
    mapController.initMap()
        .then(() => {
            mapController.addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .then(() => { mapController.checkURLQuery() });
    addEventListeners();
}

function addEventListeners() {
    // EVENT FOR GETTING USER LOCATION
    document.querySelector('.my-location').addEventListener('click', () => {
        mapService.getPosition()
            .then((position) => {
                const { latitude, longitude } = position.coords;
                mapController.panTo(latitude, longitude);
            })
            .catch(err => { })
    })





    // EVENTS FOR LOCATION BUTTONS
    document.querySelector('.location-table ul').onclick = (ev) => {

        if (ev.target.tagName === 'BUTTON') {
            var btn = ev.target;
            if (btn.innerText === 'Go') {
                mapService.getLocationById(btn.dataset.id)
                    .then((location) => {
                        console.log("document.querySelector -> location", location)
                        document.querySelector('.marker-title').innerText = location.name;

                    })
            }
            else if (btn.innerText === 'Remove') {
                mapController.removeMarker(btn.dataset.id)

                mapService.removeLocation(btn.dataset.id)
                    .then(mapController.renderLocationTable)
                    .catch((error) => {
                        console.log('unable to delete location', error)
                    }
                    )
            }
        }
    }

    // EVENT FOR SEARCH BUTTON
    document.querySelector('.go-btn').onclick = () => { mapController.onSearchLocation() };

    // EVENT FOR COPY TO URL BUTTON
    document.querySelector('.copy-url').onclick = () => { mapController.copyUrlToClipboard() };


}





