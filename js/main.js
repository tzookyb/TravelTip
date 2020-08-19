import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import {locController} from './controllers/loc-controller.js'



window.onload = () => {
    
    locController.renderLocationTable();

    mapService.initMap()
        .then(() => {
            mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));
}


// Function for getting user's location
document.querySelector('.my-location').addEventListener('click', () => {
    locService.getPosition()
        .then((position) => {
            const { latitude, longitude } = position.coords;
            mapService.panTo(latitude, longitude);
        })
        .catch(err => {
            console.log('Cannot get user-position', err);
        })
})