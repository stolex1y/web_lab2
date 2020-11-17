package stolexiy;

import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Enumeration;

@WebServlet(name = "Checker")
public class ServletChecker extends HttpServlet {

    private boolean check(Point point) {
        double X = point.getX();
        double Y = point.getY();
        int R = point.getR();

        if (X > 0) {
            if (Y > 0) {
                return false;
            } else {
                return ((Y >= (- (double) R) / 2) && (X <= R));
            }
        } else {
            if (Y > 0) {
                return Y <= (X + ((double) R) / 2);
            } else {
                // Проверка ОДЗ
                if ((((double) R * R) / 4 - X * X) < 0)
                    return false;
                return Y >= -Math.sqrt(((double) R * R) / 4 - X * X);
            }
        }
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Через сессию
        HttpSession session = request.getSession();
        Param param = (Param) session.getAttribute("param");
        long start = (long) session.getAttribute("start");

        // Через контекст
        /*ServletContext context = request.getServletContext();
        Param[] results = (Param[]) context.getAttribute("results");
        int count = ((int) context.getAttribute("count")) - 1;
        String sID = Support.getCookie(request.getCookies(), "resultID", String.valueOf(count));
        int id = Integer.parseInt(sID);
        Param param = results[id];
        Long start = ((Long[]) context.getAttribute("execute"))[id];*/

        Point last = param.last();

        last.setHit(check(param.last()));

        long end = System.currentTimeMillis();
        last.setLeadTime(start, end);

        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Europe/Moscow"));
        last.setNow(now);

        // Через сессию
        session.setAttribute("param", param);
        // Через контекст
        /*results[id] = param;
        context.setAttribute("results", results);*/

        String isAjax = request.getHeader("X-Requested-With");
        if (isAjax != null && isAjax.equals("XMLHttpRequest")) {
            response.setContentType("application/json; charset=utf-8");
            PrintWriter out = response.getWriter();
            out.println(param.toJSON());
        } else
            response.sendRedirect("");

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.sendRedirect("");
    }

}
