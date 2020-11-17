package stolexiy;

import javax.servlet.http.Cookie;

public class Support {
    public static String getCookie(Cookie[] cookies, String name, String defVal) {
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return cookie.getValue();
                }
            }
        }
        return defVal;
    }

}
