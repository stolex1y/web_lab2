package stolexiy;

import java.text.DecimalFormat;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;

public class Point {
    private double X;
    private double Y;
    private double R;
    private boolean hit;
    private long leadTime;
    private ZonedDateTime now;
    private static final DecimalFormat decimalFormatter = new DecimalFormat("#.##");
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.MEDIUM);
    private boolean strict = true;

    /*public Point(int X, double Y, int R, boolean hit, long leadTime, ZonedDateTime now) {
        this.X = X;
        this.Y = Y;
        this.R = R;
        this.hit = hit;
        this.leadTime = leadTime;
        this.now = now;
    }*/

    public Point() {
        X = 0;
        Y = 0.0;
        R = 1;
        hit = false;
    }

    public void setStrict(boolean strict) {
        this.strict = strict;
    }

    public void setLeadTime(long leadTime) {
        this.leadTime = leadTime;
    }

    public void setLeadTime(long start, long end) {
        leadTime = end - start;
    }

    public void setNow(ZonedDateTime now) {
        this.now = now;
    }

    public boolean isHit() {
        return hit;
    }

    public void setHit(boolean hit) {
        this.hit = hit;
    }

    public double getR() {
        return R;
    }

    /*public String getR_str() {
        return decimalFormatter.format(R);
    }*/

    public void setR(String strR) throws IllegalArgumentException {
        try {
            R = Double.parseDouble(strR);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Ошибка: в поле 'Параметр R' не число!");
        }
        if (R < 1.0 || R > 3.0) {
            R = 1.0;
            throw new IllegalArgumentException("Ошибка: недопустимое число в поле 'Параметр R'!");
        }
    }

    public double getX() {
        return X;
    }

    public void setX(String strX) throws IllegalArgumentException {
        try {
            X = Double.parseDouble(strX);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Ошибка: в поле 'Координата X' не число!");
        }
        if (strict) {
            if (X < -3.0 || X > 5.0) {
                X = 0.0;
                throw new IllegalArgumentException("Ошибка: недопустимое число в поле 'Координата X'!");
            }
        }
    }

    public double getY() {
        return Y;
    }

    public void setY(String strY) throws IllegalArgumentException {
        try {
            strY = strY.replaceAll(",", "\\.");
            Y = Double.parseDouble(strY);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Ошибка: в поле 'Координата Y' не число!");
        }
        if (strict) {
            if (Y < -3.0 || Y > 5.0) {
                Y = 0.0;
                throw new IllegalArgumentException("Ошибка: недопустимое число в поле 'Координата Y'!");
            }
        }
    }

    @Override
    public String toString() {
        return "Point{" +
                "X=" + Math.round(X) +
                ", Y=" + Y +
                ", R=" + R +
                ", hit=" + hit +
                ", leadTime=" + leadTime +
                ", now=" + now +
                '}';
    }

    public String toTableRow() {
        return "<tr>" +
                "<td>" + dateFormatter.format(now) + "</td>" +
                "<td>" + leadTime + "</td>" +
                "<td>" + decimalFormatter.format(X) + "</td>" +
                "<td>" + decimalFormatter.format(Y) + "</td>" +
                "<td>" + decimalFormatter.format(R) + "</td>" +
                "<td>" + (hit ? "Попадание" : "Промах") + "</td>" +
                "</tr>";
    }

    private String toNameValue(String name, String value) {
        return "\"" + name + "\": \"" + value + "\"";
    }

    public String toJSON() {
        return "{" +
                toNameValue("1now", dateFormatter.format(now)) + "," +
                toNameValue("2leadTime", String.valueOf(leadTime)) + "," +
                toNameValue("3X", decimalFormatter.format(X)) + "," +
                toNameValue("4Y", decimalFormatter.format(Y)) + "," +
                toNameValue("5R", decimalFormatter.format(R)) + "," +
                toNameValue("6hit", (hit ? "Попадание" : "Промах")) +
                "}";
    }
}
