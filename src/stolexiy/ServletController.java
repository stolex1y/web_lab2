package stolexiy;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.Objects;


@WebServlet(name = "Controller")
public class ServletController extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Param param;
        // Через сессию
        /*HttpSession session = request.getSession(true);
        param = (Param) session.getAttribute("param");*/

        // Через контекст
        ServletContext context = request.getServletContext();
        Param[] results = (Param[]) context.getAttribute("results");
        int id;
        try {
            int count = ((int) context.getAttribute("count")) - 1;
            // Значение по умолчанию - (счётчик клиентов - 1), так как новый клиент добавляется в конец массива результатов
            String sID = Support.getCookie(request.getCookies(), "resultID", String.valueOf(count));
            id = Integer.parseInt(sID);
            param = results[id];

            // В любом случае устанавливаем куки клиента с его id, даже если они у него уже есть
            Cookie resultID = new Cookie("resultID", sID);
            response.addCookie(resultID);
        } catch (NumberFormatException e) {
            throw new ServletException("Ошибочные данные в cookie.");
        }

        long start = System.currentTimeMillis();
        Point point = new Point();
        String isAjax = request.getHeader("X-Requested-With");
        if (isAjax != null && isAjax.equals("XMLHttpRequest")) {
            point.setStrict(false);
        }
        try {
            point.setX(request.getParameter("input-X"));
            point.setY(request.getParameter("input-Y"));
            point.setR(request.getParameter("input-R"));
            param.setError("");
        } catch (IllegalArgumentException e) {
            param.setError(e.getMessage());
            response.sendRedirect("");
            return;
        }
        param.add(point);
        // Через сессию
//        session.setAttribute("start", start);

        // Через контекст
        if (Objects.isNull(context.getAttribute("execute"))) {
            context.setAttribute("execute", new Long[results.length]);
        }
        // Данный массив нужен для сохранения данных о начале работы скрипта проверки точки
        Long[] execute = (Long[]) context.getAttribute("execute");
        if (id >= execute.length) {
            execute = Arrays.copyOf(execute, id + 10);
        }
        execute[id] = start;
        context.setAttribute("execute", execute);

        // После проверки и сохранения всех данных перенаправляемся на Checker
        request.getServletContext().getNamedDispatcher("Checker").forward(request, response);

    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        doGet(request, response);
    }
}
