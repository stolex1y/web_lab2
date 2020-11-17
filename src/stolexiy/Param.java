package stolexiy;

import java.util.*;

public class Param {
    private List<Point> points;
    private String error;
    private Point last;

    public Param() {
        setDefault();
    }

    public List<Point> getPoints() {
        return Collections.unmodifiableList(points);
    }

    public void add(Point point) {
        while (points.size() >= 10) {
            points.remove(0);
        }
        points.add(point);
        last = point;
    }

    public Point last() {
        return last;
    }

    public void setDefault() {
        points = new ArrayList<>();
        last = new Point();
        error = "";
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    @Override
    public String toString() {
        return "Param{" +
                "points=" + points +
                ", error='" + error + "'" +
                ", last=" + last +
                '}';
    }

    public String toJSON() {
        StringBuilder result = new StringBuilder("[");
        Iterator<Point> iterator = points.iterator();
        while (iterator.hasNext()) {
            result.append(iterator.next().toJSON());
            if (iterator.hasNext())
                result.append(",");
        }
        result.append("]");
        return result.toString();
    }
}
