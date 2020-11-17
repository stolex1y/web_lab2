function postRequest(msg, callback) {
    let request = new XMLHttpRequest();
    request.open("POST", "controller");
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            let type = request.getResponseHeader("Content-Type");
            if (type.match(/text\/html/)) {
                window.location.reload();
            } else {
                let text = request.responseText;
                callback(type, text);
            }
        }
    }
    request.send(msg);
}

// Выполняет URI-кодирование объекта data, возвращает строку параметров вида
// имя=значение&имя1=значение1&...
function encodeFormData(data) {
    if (!data) return "";
    let pairs = [];
    for(let name in data) {
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === "function") continue;
        let value = data[name].toString();
        name = encodeURIComponent(name.replace("%20", "+"));
        value = encodeURIComponent(value.replace("%20", "+"));
        pairs.push(name + "=" + value);
    }
    return pairs.join("&");
}
