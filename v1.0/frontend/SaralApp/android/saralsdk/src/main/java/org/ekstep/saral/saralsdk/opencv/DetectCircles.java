package org.ekstep.saral.saralsdk.opencv;

import android.util.Log;

import org.ekstep.saral.saralsdk.commons.CVOperations;

import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.Scalar;
import org.opencv.imgproc.Imgproc;

import java.util.ArrayList;
import java.util.List;

public class DetectCircles {
    private static final String  TAG                = "SrlSDK::Circles";
    private boolean DEBUG                           = false;
    private static final Scalar RED_COLOR           = new Scalar(255.0, 0.0, 0.0);
    private String mShadedIndex                     = null;

    public DetectCircles(boolean debug) {
        DEBUG = debug;
    }

    public String getmShadedIndex() {
        return mShadedIndex;
    }

    public boolean processMat(Mat frameImage, Mat image, Point tableTopLeft, Point rowTopLeft) {
        if (image.rows() < 60) {
            return false;
        }
        List <Double> circleResults = extractCircles_V1(image);

        if (circleResults.size() == 6) {
            Log.d(TAG, "circle percentage: " + circleResults.toString());
            int index       = getIndexOfLargest(circleResults);
            mShadedIndex    = new Integer(index).toString();

            if (DEBUG) {
                Imgproc.putText(frameImage, mShadedIndex,
                        new Point(tableTopLeft.x+rowTopLeft.x, tableTopLeft.y+rowTopLeft.y),
                        Imgproc.COLOR_RGB2BGR,
                        1,
                        RED_COLOR);
            }

            return true;
        }

        return false;
    }
    private List <Double> extractCircles_V1(Mat image) {
        List <Double> circleResults = new ArrayList<>();
        Mat gray                    = new Mat();
        Mat bw                      = new Mat();

        Rect b1 = new Rect(20+0*38, 10, 38, 36);
        Rect b2 = new Rect(20+1*38, 10, 38, 36);
        Rect b3 = new Rect(20+2*38, 10, 38, 36);
        Rect b4 = new Rect(20+3*38, 10, 38, 36);
        Rect b5 = new Rect(20+4*38, 10, 38, 36);
        Rect b6 = new Rect(20+5*38, 10, 38, 36);

        List <Rect> rects = new ArrayList<>();
        rects.add(b1);
        rects.add(b2);
        rects.add(b3);
        rects.add(b4);
        rects.add(b5);
        rects.add(b6);
        Log.d(TAG, "rows :: " + image.rows() + " cols: " + image.cols());
        Log.d(TAG, "circles :" + rects.toString());

        Imgproc.cvtColor(image, gray, Imgproc.COLOR_BGR2GRAY);
        Imgproc.medianBlur(gray, gray, 5);

        for (int i = 0; i < rects.size(); i++) {
            Rect r      = rects.get(i);
            Mat ROI     = gray.submat(r);
            Imgproc.threshold(ROI, bw, 127, 255, Imgproc.THRESH_BINARY);

            int total_pixels = bw.cols() * bw.rows();
            int zero_pixels  = total_pixels - Core.countNonZero(bw);
            double area     = (r.width * r.width * 3.141);
            Double shaded   = new Double((zero_pixels / area) * 100);
                circleResults.add(shaded);
        }

        return circleResults;
    }

    private List <Double> extractCircles(Mat image) {
        List <Double> circleResults = new ArrayList<>();
        Mat gray                    = new Mat();
        Mat bw                      = new Mat();

        Imgproc.cvtColor(image, gray, Imgproc.COLOR_BGR2GRAY);
        Imgproc.medianBlur(gray, gray, 5);
        Mat circles     = new Mat();
        Imgproc.HoughCircles(gray, circles, Imgproc.CV_HOUGH_GRADIENT,1.5,10.0, 100.0, 30.0, 5, 15);

        List <Rect> circleRects = new ArrayList<>();
        for (int i = 0; i < circles.cols(); i++ ) {
            double vCircle[] = circles.get(0, i);
            if (vCircle == null) {
                break;
            }
            Point center = new Point(Math.round(vCircle[0]), Math.round(vCircle[1]));
            int radius = (int) Math.round(vCircle[2]);
            Rect r = new Rect((int)center.x, (int)center.y, radius, 10);
            circleRects.add(r);
        }
        circleRects = CVOperations.sortRectsTOLeft(circleRects);
        Log.d(TAG, "circles :" + circleRects.toString());

        for (int i = 0; i < circleRects.size(); i++) {
            Rect r      = circleRects.get(i);
            Mat ROI     = new Mat(image, r);
            CVOperations.saveImage(ROI, "omr_in_" + i, 3, false);

//            Mat ROI     = gray.submat(new Rect((int)(r.x-r.width), (int)(r.y-r.width), r.width*2, r.width*2));
            Imgproc.threshold(ROI, bw, 127, 255, Imgproc.THRESH_BINARY);
            int total_pixels = bw.cols() * bw.rows();
            int zero_pixels  = total_pixels - Core.countNonZero(bw);
            double area     = (r.width * r.width * 3.141);
            Double shaded   = new Double((zero_pixels / area) * 100);
            circleResults.add(shaded);
        }

        return circleResults;
    }

    private final void drawPOIArea(Mat frameImage, Mat image, List<Rect> boxes, Scalar color, Point tableTopLeft) {
        if (DEBUG) {
            for (int i = 0; i < boxes.size(); i++) {
                Rect r = boxes.get(i);

                if (0 <= r.x
                        && 0 <= r.width
                        && r.x + r.width <= image.cols()
                        && 0 <= r.y
                        && 0 <= r.height
                        && r.y + r.height <= image.rows()) {

                    Imgproc.rectangle(frameImage, new Point(r.x + tableTopLeft.x, r.y + tableTopLeft.y),
                            new Point(r.x + r.width + tableTopLeft.x, r.y + r.height + tableTopLeft.y), color, 2);

                    Mat cropped = new Mat(image, r);
                    CVOperations.saveImage(cropped, "char_" + i, 3, false);
                }
            }
        }
    }

    private int getIndexOfLargest(List<Double> array) {
        if ( array == null || array.size() == 0 ) return -1; // null or empty
        int largest = 0;
        for ( int i = 1; i < array.size(); i++ ) {
            if ( array.get(i) > array.get(largest) ) largest = i;
        }
        if (array.get(largest) < 1.00)
            return 0;

        return largest;
    }
}
