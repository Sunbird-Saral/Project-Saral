package org.ekstep.saral.saralsdk.commons;

import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.os.Environment;
import android.util.Log;

import org.opencv.android.Utils;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.imgproc.Imgproc;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

public class CVOperations {
    private static final String  TAG              = "SrlSDK::CVOps";

    public static List<Point> getCirclesPoint(Mat circles) {
        List<Point> points = new ArrayList<Point>();
        for (int x = 0; x < circles.cols(); x++) {
            double[] c = circles.get(0, x);
            Point center = new Point(Math.round(c[0]), Math.round(c[1]));
            points.add(center);
        }
        return points;
    }

    public static void sortPointListFromLeft(List<Point> points) {
        Collections.sort(points, (Comparator<Point>)(o1, o2) -> {
            if (o1.x > o2.x) {
                return 1;
            } else if (o1.x < o2.x) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    public static void sortPointListFromTop(List<Point> points) {
        Collections.sort(points, (Comparator<Point>)(o1, o2) -> {
            if (o1.y > o2.y) {
                return 1;
            } else if (o1.y < o2.y) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    private static String getAlphaNumericString(int n) {
        String AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                + "0123456789"
                + "abcdefghijklmnopqrstuvxyz";
        StringBuilder sb = new StringBuilder(n);
        for (int i = 0; i < n; i++) {
            int index = (int)(AlphaNumericString.length() * Math.random());
            sb.append(AlphaNumericString.charAt(index));
        }
        return sb.toString();
    }

    public static String saveImage(Mat image, String name, int randomLength, boolean flip) {
        String random       = getAlphaNumericString(randomLength);
        String filepath     = FileOps.getInstance().getBaseDirectoryPath() + "/" + name + "_" + random + ".jpg";
        byte[] byteArray    = null;

        Bitmap resultBitmap = Bitmap.createBitmap(image.cols(), image.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(image, resultBitmap);
        if (flip) {
            Matrix matrix = new Matrix();
            matrix.setRotate(90F);
            Bitmap bmRotated = Bitmap.createBitmap(resultBitmap, 0, 0, resultBitmap.getWidth(), resultBitmap.getHeight(), matrix, true);

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            resultBitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
            byteArray = byteArrayOutputStream.toByteArray();
        } else {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            resultBitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
            byteArray = byteArrayOutputStream.toByteArray();
        }

        try {
            FileOutputStream fos = new FileOutputStream(filepath);
            fos.write(byteArray);
            fos.close();

        } catch (java.io.IOException e) {
            Log.d(TAG, "Image saving failed", e);
        }
        Log.d(TAG, "Saving file: " + filepath);

        return filepath;
    }

    public static void deleteAllImages() {
        File dir = FileOps.getInstance().getBaseDirectory();
        if (dir.isDirectory()) {
            String[] children = dir.list();
            for (int i = 0; i < children.length; i++) {
                String filename = children[i];
                if (filename.endsWith(".jpeg") || filename.endsWith(".jpg"))
                    new File(dir, filename).delete();
            }
        }
    }

    public static List<Rect> sortRects(List<Rect> rects) {
        Collections.sort(rects, (r1, r2) -> {
            if (r1.x >= r2.x && r1.y >= r2.y) {
                return 1;
            }
            return -1;
        });
        return rects;
    }

    public static List<Rect> sortRectsTOLeft(List<Rect> rects) {
        Collections.sort(rects, (r1, r2) -> {
            if (r1.x >= r2.x) {
                return 1;
            }
            return -1;
        });
        return rects;
    }

    public static List<MatOfPoint> sortContours(List<MatOfPoint> contourList, String type) {
        if(type.equals("topToBottom")) {
            Collections.sort(contourList, (o1, o2) -> {
                Rect rect1 = Imgproc.boundingRect(o1);
                Rect rect2 = Imgproc.boundingRect(o2);
                if (rect1.y > rect2.y) {
                    return 1;
                } else if (rect1.y < rect2.y) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
        else if(type.equals("leftToRight")) {
            Collections.sort(contourList, (o1, o2) -> {
                Rect rect1 = Imgproc.boundingRect(o1);
                Rect rect2 = Imgproc.boundingRect(o2);
                if (rect1.x > rect2.x) {
                    return 1;
                } else if (rect1.x < rect2.x) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
        return contourList;
    }
}
