<%@ page import="stolexiy.Param" %>
<%@ page import="stolexiy.Point" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="stolexiy.Support" %>
<%@ page import="java.util.List" %>
<%--
  Created by IntelliJ IDEA.
  User: Alexey
  Date: 05.11.2020
  Time: 14:27
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" %>

<%--Через сессию--%>
<%--<%
    Param param = new Param();
    if (!session.isNew()) {
        param = (Param) session.getAttribute("param");
    } else {
        param.setDefault();
        session.setAttribute("param", param);
    }
%>--%>
<%--Через контекст--%>
<%
    Param param; // Параметры текущего клиента
    ServletContext context = getServletConfig().getServletContext();
    // Проверяем, есть ли счётчик в атрибутах
    if (context.getAttribute("count") == null) {
        // Если нет создаём его + массив с результатами
        context.setAttribute("count", 0);
        context.setAttribute("results", new Param[10]);
    }
    Param[] results = (Param[]) context.getAttribute("results");
    int count = (int) context.getAttribute("count");

    // Номер элемента с результатами хранится в куки клиента с именем resultID
    String strId = Support.getCookie(request.getCookies(), "resultID", String.valueOf(count));
    // Так как в атрибутах контекста обычный массив, нужно следить за его переполнением
    if (Integer.parseInt(strId) >= results.length) {
        results = Arrays.copyOf(results, count + 10);
    }
    // Наконец, получаем результаты и параметры последнего запроса текущего клиента
    param = results[Integer.parseInt(strId)];
    if (param == null) {
        // Или создаём их заново
        param = new Param();
        results[Integer.parseInt(strId)] = param;
    }
    // Не забываем сохранить в контекст новое значение счётчика и параметры
    context.setAttribute("count", ++count);
    context.setAttribute("results", results);
%>
<%--JavaBean--%>
<%--<jsp:useBean id="param" class="stolexiy.Param" scope="session" /> --%>


<%
    Point last = param.last();
%>

<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <title>Lab 2</title>
    <script type="text/javascript" src="scripts/graphic.js" defer></script>
    <script type="text/javascript" src="scripts/ajax.js" defer></script>
    <script type="text/javascript" src="scripts/validation.js" defer></script>
    <link rel="stylesheet" type="text/css" href="styles/global.css">
    <link rel="stylesheet" type="text/css" href="styles/form.css">
    <link rel="stylesheet" type="text/css" href="styles/table.css">
</head>
<body>
<header class="">
    <span id="name">Филимонов Алексей Александрович</span>
    <span id="group">P3231</span>
    <span id="var">Вариант: 2745</span>
</header>
<main>
    <img src="resources/areas.png" width="223" height="219" alt="Выделенные области">
    <canvas id="graphic" width="223" height="219"></canvas>
    <form method="get" action="controller" name="param">
        <p>
            <input type="hidden" name="input-X" id="input-X" value="<%= last.getX() %>" class="choose">
            Координата X:
            <%
                String className;
                for(int i = -3; i < 6; i++) {
                    if (i == last.getX()) className = "pushed";
                    else className = "";
                    out.println("<button class='" + className + " choose' type='button' name='button-X' id='button-" + i + "'>" + i + "</button>");
                }
            %>
        </p>
        <p>
            <label for="input-Y">Координата Y:</label>
            <input class="choose" type="text" name="input-Y" id="input-Y" placeholder="(-3 &hellip; 5)" size="3" value="">
        </p>
        <p>
            <input data-scale="1" type="hidden" name="input-R" id="input-R" value="<%= last.getR() %>" class="choose">
            Параметр R:
            <%
                for(double i = 1; i < 3.5; i += 0.5) {
                    if (i == last.getR()) className = "pushed";
                    else className = "";
                    out.println("<button class='" + className + " choose' type='button' name='button-R' id='button-" + i + "'>" + String.valueOf(i).replaceAll("\\.", ",") + "</button>");
                }
            %>
        </p>
        <button class="choose" id="button-submit" type="submit" name="button-submit">Проверить</button>
        <span class="error"><%= param.getError() %></span>
    </form>
</main>
<section id="results">
    <table <%= param.getPoints().size() == 0 ? "class='hidden'":"" %>>
    <caption>Результаты</caption>
    <thead>
    <tr>
        <th>Дата получения запроса</th>
        <th>Выполнение, мс</th>
        <th>X</th>
        <th>Y</th>
        <th>R</th>
        <th>Результат</th>
    </tr>
    </thead>
    <tbody id="main">
        <%
            List<Point> points = param.getPoints();
            Point point;
            for (int i = points.size() - 1; i >= 0; i--) {
                point = points.get(i);
                out.println(point.toTableRow());
            }
        %>
    </tbody>
    </table>
</section>
<footer>
    <span>Университет ИТМО 2020</span>
</footer>
</body>
</html>
