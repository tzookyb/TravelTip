function saveToStorage(key, data) {
    const data = JSON.stringify(data);
    localStorage.setItem(key, data);
}

function loadFromStorage(key) {
    var data = localStorage.getItem(key);
    data = JSON.parse(data);
    return data;
}
