package org.ekstep.saral.saralsdk.commons;

import org.opencv.core.Rect;

import java.util.ArrayList;
import java.util.List;

public class BoxRect {
    public int x;
    public int y;
    public int width;
    public int height;

    BoxRect(int x, int y, int width, int height) {
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
    }

    public Rect getCropRect() {
        Rect r = new Rect(this.x, this.y, this.width, this.height);
        return r;
    }

    public String toString() {
        return "{" + x + ", " + y + ", " + width + "x" + height + "}";
    }

    public static List<BoxRect> getBoxRects(List<Rect> col1, List<Rect>col2) {
        List<BoxRect> boxes = new ArrayList<>();
        for (int i = 0; i < col1.size()-1; i++) {
            BoxRect box = new BoxRect(col1.get(i).x,
                    col1.get(i).y,
                    (col2.get(i+1).x + col2.get(i+1).width) - col1.get(i).x,
                    (col2.get(i+1).y + col2.get(i+1).height) - col1.get(i).y);
            boxes.add(box);
        }
        return boxes;
    }
}
