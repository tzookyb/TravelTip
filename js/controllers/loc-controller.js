import { locService } from '../services/loc.service.js';

export const locController = {
    renderLocationTable,
}

export function renderLocationTable() {
    var strHTML;
    locService.getLocs().then(locations => {
        strHTML = locations.map(location => {
            return `
            <li>
            <h4>${location.name}</h4>
            <p>${locService.getHumanTime(location.createdAt)}</p>
            <button data-id="${location.id}">Go</button>
            <button data-id="${location.id}">Remove</button>
            </li>
            `
        })
        document.querySelector('.location-table ul').innerHTML = strHTML;
    })
}