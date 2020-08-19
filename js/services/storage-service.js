export const storageService = {
    save,
    load,
}

function save(key, data) {
    data = JSON.stringify(data);
    localStorage.setItem(key, data);
}

function load(key) {
    var data = localStorage.getItem(key);
    data = JSON.parse(data);
    return data;
}
