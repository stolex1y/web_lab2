function setError(text, elem) {
    let button = document.getElementById("button-submit");
    let error = document.querySelector("span.error");

    button.disabled = true;
    error.classList.remove("hidden");
    error.innerHTML = text;
    elem.classList.add("error");
}
function unsetError(elem) {
    let button = document.getElementById("button-submit");
    let error = document.querySelector("span.error");

    button.disabled = false;
    error.classList.add("hidden");
    elem.classList.remove("error");
}
document.getElementById("input-Y").oninput = function() {
    let reg = /^[+-]?\d+[.,]?\d*$/
    if (!reg.test(this.value)) {
        setError("Ошибка: в поле 'Координата Y' не число!", this);
        return false;
    } else {
        let value = parseFloat(this.value);
        if (value < -3.0 || value > 5.0) {
            setError("Ошибка: в поле 'Координата Y' недопустимое число!", this);
            return false;
        } else {
            unsetError(this);
        }
    }
    return true;
}

// Для переключения кнопок c именем buttonsName и элементом hiddenId
function onclickButton(event, buttonsName, hiddenId) {
    let elements = document.getElementsByName(buttonsName);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains("pushed"))
            elements[i].classList.remove("pushed");
    }

    let current = event.currentTarget;
    (current.classList.contains("pushed"))
        ? current.classList.remove("pushed")
        : current.classList.add("pushed");
    let hidden = document.getElementById(hiddenId);
    hidden.value = current.innerHTML.replace(",", ".");
}
let buttonsR = document.getElementsByName("button-R");
// Для каждой кнопки button-R, добавление слушателя на нажатие
for (let i = 0; i < buttonsR.length; i++) {
    buttonsR[i].addEventListener("click", function (event) {
        onclickButton(event, "button-R", "input-R");
    }, false);
}

let buttonsX = document.getElementsByName("button-X");
// Для каждой кнопки button-X, добавление слушателя на нажатие
for (let i = 0; i < buttonsX.length; i++) {
    buttonsX[i].addEventListener("click", function (event) {
        onclickButton(event, "button-X", "input-X");
    }, false);
}

// Используется как функция обратного вызова в методе postRequest (ajax.js).
// Отвечает за обновление информации в таблице и на графике
function ajaxCallback(type, text) {
    if (type.match(/^application\/json/)) {
        let table = document.querySelector("section#results table");
        if (table.classList.contains("hidden")) {
            table.classList.remove("hidden");
        }
        addRowInTable(table.tBodies["main"], text);
    }
    drawPlate();
    drawOldPoints();
}
// Добавляет строку в таблицу table, строка закодирована в объект param в
// JSON-формате
function addRowInTable(table, param) {
    let arr = JSON.parse(param);
    table.innerHTML = "";
    let innerHTML = "";
    // Массив в таблице получается перевернутый, а новая строка появляется сверху
    for (let i = arr.length - 1, row = arr[i]; i >= 0; row = arr[--i]) {
        innerHTML += "<tr>";
        for (let cell in row) {
            if (!row.hasOwnProperty(cell)) continue;
            if (typeof row[cell] === "function") continue;
            let value = row[cell].toString();
            innerHTML += "<td>" + value + "</td>";
        }
        innerHTML += "</tr>"
    }
    table.innerHTML = innerHTML;
}
// Для перехвата события отправки формы, чтобы проверить данные и, используя ajax,
// обновить таблицу и график
function beforeSubmit(event) {
    if (!document.getElementById("input-Y").oninput(null)) {
        if (event.preventDefault) event.preventDefault();
        if (event.returnValue) event.returnValue = false;
        return false;
    }
    let X = document.getElementById("input-X");
    let Y = document.getElementById("input-Y");
    let R = document.getElementById("input-R");
    let request = encodeFormData({
        "input-X": X.value,
        "input-Y": Y.value,
        "input-R": R.value
    })
    postRequest(request, ajaxCallback);

    if (event.preventDefault) event.preventDefault();
    if (event.returnValue) event.returnValue = false;
    return false;
}
document.forms["param"].addEventListener("submit", beforeSubmit, true);

// Для вывода сообщений об ошибках при отладке
/*
window.onerror = function(msg, url, line) {
    alert("Ошибка: " + msg + "\n" + url + ":" + line);
    return true;
};
*/
