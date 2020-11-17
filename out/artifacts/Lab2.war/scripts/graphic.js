// Убирает график по-умолчанию в виде png
document.images[0].classList.add("none");

let canvas = document.querySelector("canvas#graphic");
let c = canvas.getContext("2d");

// Отвечает за прорисовку графика
let drawPlate = function () {
    c.restore();
    c.save();
    c.strokeStyle = "green";
    c.moveTo(0, 0);
    c.lineTo(20, -20);
    c.stroke();
    let R = document.getElementById("input-R");
    if (!R.value) return;

    // Белый фон
    c.fillStyle = "#fff";
    let width = canvas.width;
    let height = canvas.height;
    c.fillRect(0, 0, width, height);

    // Черная рамка
    c.strokeStyle = "#000";
    c.lineWidth = 1;
    c.strokeRect(0, 0, width, height);

    // Фигуры
    let offset = 10;
    c.translate(width / 2, height / 2);
    let xLen = width - 2 * offset - 4 * offset;
    let yLen = height - 2 * offset - 4 * offset;
    let unitR = div(xLen, 4) * 2;
    R.dataset["scale"] = (unitR).toString();
    c.miterLimit = 0;
    let figureColor = "#39F";
    // Ось X направлена вправо, а Y вниз!
    drawTriangle(c, +unitR, 0, 0, -unitR/2, figureColor);
    drawRect(c, -unitR, 0, 0, -unitR/2, figureColor);
    drawCircle(c, 0, 0, unitR/2, 4, figureColor);

    // Координатная плоскость поверх всего, чтобы были видны оси и деления
    c.font = "14px monospaced";
    drawCoordinates(c, width, height, offset);
    let axisWidth = 1;
    drawDashes(c, xLen, div(xLen, 4), -1, 2,
        yLen, div(yLen, 4), -1, 2,
        2 + axisWidth);
}
// Рисует все старые точки, данные берет из таблицы
let drawOldPoints = function() {
    let table = document.querySelector("section#results table");
    let Xi, Yi, Ri;
    for (let cell of table.rows[0].cells) {
        if (cell.textContent === "X") Xi = cell.cellIndex;
        if (cell.textContent === "Y") Yi = cell.cellIndex;
        if (cell.textContent === "R") Ri = cell.cellIndex;
    }

    let tbody = table.tBodies["main"];
    let scale = Number(document.getElementById("input-R").dataset["scale"]);
    let X; let Y; let R;
    for (let i = 0; i < tbody.rows.length; i++) {
        let cells = tbody.rows[i].cells;
        X = Number(cells[Xi].textContent.replaceAll(",", ".")); Y = Number(cells[Yi].textContent.replaceAll(",", ".")); R = Number(cells[Ri].textContent.replaceAll(",", "."));
        drawPoint(c, X / R * scale, -Y / R * scale);
    }
}
window.addEventListener("load", drawPlate, false);
window.addEventListener("load", drawOldPoints, false);

// Добавляет слушатель события нажатия на canvas, а именно: при нажатии
// данные отправляются серверу, а в качестве callback используется
// ajaxCallback (validation.js)
canvas.onclick = function (event) {
    let R = document.getElementById("input-R");
    let scale = Number(R.dataset["scale"]);
    let x = getXinCanvas(event, canvas) - canvas.width / 2;
    let y = getYinCanvas(event, canvas) - canvas.height / 2;
    drawPoint(c, x, y);

    x = x / scale * R.value;
    y = y / scale * R.value;
    let request = encodeFormData({
        "input-X": x,
        "input-Y": -y,
        "input-R": R.value
    })
    postRequest(request, ajaxCallback);
}

function drawPoint(c, x, y) {
    c.save();
    c.fillStyle = "red";
    c.moveTo(x, y);
    c.arc(x, y, 1.5, 0, 2 * Math.PI);
    c.fill();
    c.restore();
}

// Получение координат X, Y при нажатии на canvas (относительно canvas),
// используя событие нажатия event
function getXinCanvas(event, canvas) {
    if (!event || !canvas) return NaN;
    let bcr = canvas.getBoundingClientRect();
    return (event.clientX - bcr.left) * (canvas.width / bcr.width);
}
function getYinCanvas(event, canvas) {
    if (!event || !canvas) return NaN;
    let bcr = canvas.getBoundingClientRect();
    return (event.clientY - bcr.top) * (canvas.height / bcr.height);
}

// Отмена контекстного меню
canvas.oncontextmenu = function (event) {
    return stopDefAction(event);
};

// Отмена действий по умолчанию для какого-то события event
function stopDefAction(event) {
    if (event.preventDefault) event.preventDefault();
    if (event.returnValue) event.returnValue = false;
    return false;
}

function drawAxis(c, length, sign, rotated, lineWidth, color, tipLen, tipAngle) {
    lineWidth = lineWidth || 1;
    color = color || "#000";
    if (sign !== "" && !sign) {
        sign = "";
    }
    c.save();
    c.lineWidth = lineWidth;
    c.strokeStyle = color;
    c.beginPath();
    let x = 0; let y = 0; c.moveTo(x, y);
    x = length; y = 0; c.lineTo(x, y);
    tipLen = tipLen || 7;
    tipAngle = tipAngle || Math.PI / 6;
    x -= tipLen; y += Math.tan(tipAngle) * tipLen; c.lineTo(x, y);
    x += tipLen; y -= Math.tan(tipAngle) * tipLen; c.moveTo(x, y);
    x -= tipLen; y -= Math.tan(tipAngle) * tipLen; c.lineTo(x, y);
    c.stroke();

    c.translate(x, y);
    x = tipLen; y = 0;
    c.fillStyle = color || "#000";
    c.rotate(-rotated);
    c.fillText(sign, x, y);
    c.restore();
}
function drawDashes(c, xLen, xUnit, xMin, dx,
                    yLen, yUnit, yMin, dy,
                    dashLen, lineWidth, color) {
    c.save();
    dashLen = dashLen || 4;
    function drawDash(c, length) {
        c.moveTo(0, -length);
        c.lineTo(0, length);
        c.stroke();
    }
    lineWidth = lineWidth || 1;
    color = color || "#000";
    c.lineWidth = lineWidth;
    c.strokeStyle = color;
    c.fillStyle = color;

    c.save();
    c.beginPath();
    let left = xLen / 2;
    let dashCount = 0;
    while (left - xUnit > 0) {
        c.translate(-xUnit, 0);
        left -= xUnit;
        dashCount++;
    }
    dashCount = dashCount * 2 + 1; // одна дополнительная черта на оси координат
    let text;
    xMin *= dx;
    
    function getText(p, dp) {
        let text;
        if (p === 0) {
            text = "";
        } else if (p % dp === 0) {
            if (p / dp === 1) {
                text = "R";
            } else if (p / dp === -1) {
                text = "-R";
            } else
                text = (p / dp) + "R";
        } else {
            text = p + "/" + dp + "R";
        }
        return text;
    }
    for (let i = 0; i <= dashCount; i++) {
        drawDash(c, dashLen);
        text = getText(xMin, dx);
        c.fillText(text, -xUnit / 4, -xUnit / 4);
        xMin += 1;
        c.translate(xUnit, 0);
    }
    c.restore();

    left = yLen / 2;
    dashCount = 0;
    while (left - yUnit > 0) {
        c.translate(0, -yUnit);
        left -= xUnit;
        dashCount++;
    }
    c.rotate(Math.PI / 2);
    c.stroke();
    dashCount = dashCount * 2 + 1;
    let yMax = -yMin * dy;
    for (let i = 0; i <= dashCount; i++) {
        drawDash(c, dashLen);
        text = getText(yMax, dy);
        c.rotate(-Math.PI / 2);
        c.fillText(text, yUnit / 4, yUnit / 8);
        c.rotate(Math.PI / 2);
        yMax -= 1;
        c.translate(yUnit, 0);
    }
    c.restore();
}
function drawCoordinates(c, width, height, offset, axisWidth) {
    // Координатная плоскость
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    offset = offset || 10;
    c.translate(offset, height / 2);
    axisWidth = axisWidth || 1;
    drawAxis(c, width - 2 * offset, "X", 0, axisWidth);
    c.translate(width / 2 - offset, height / 2 - offset);
    c.rotate(-Math.PI / 2);
    drawAxis(c, height - 2 * offset, "Y", -Math.PI / 2, axisWidth);
    c.restore();
}
function drawTriangle(c, x1, y1, x2, y2, color) {
    c.save();
    c.fillStyle = color || "#000";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(x1, y1);
    c.lineTo(x2, y2);
    c.closePath();
    c.fill();
    c.restore();
}
function drawRect(c, x1, y1, x2, y2, color) {
    c.save();

    c.moveTo(x1, y1);
    c.beginPath();
    c.fillStyle = color || "#000";
    c.fillRect(x1, y1, x2 - x1, y2 - y1);

    c.restore();
}
function drawCircle(c, x, y, r, qr, color) {
    c.save();

    c.beginPath();
    c.moveTo(x, y);
    c.fillStyle = color || "#000";
    let startAngle = -Math.PI/2 * (qr - 1);
    let endAngle = startAngle - Math.PI/2;
    c.arc(x, y, r, startAngle, endAngle, true);
    c.fill();

    c.restore();
}

// Просто целочисленное деление..
function div(val, by){
    return (val - val % by) / by;
}
