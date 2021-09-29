package org.ekstep.saral.saralsdk.opencv;

import android.util.Log;

import org.ekstep.saral.saralsdk.commons.BoxRect;
import org.ekstep.saral.saralsdk.commons.CVOperations;

import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

import java.util.ArrayList;
import java.util.List;

public class ExtractTableRows {
    private static final String  TAG                = "SrlSDK::TableROIs";
    private boolean DEBUG                           = false;
    private static final int NUM_OF_POINTS          = 24;
    private static final Scalar RED_COLOR           = new Scalar(255.0, 0.0, 0.0);
    private static final Scalar GREEN_COLOR         = new Scalar(0.0, 255.0, 0.0);
    private static final Scalar BLUE_COLOR          = new Scalar(0.0, 0.0, 255.0);

    public ExtractTableRows(boolean debug) {
        DEBUG = debug;
    }

    public List<BoxRect> processMat(Mat frameImage, Mat image, double roiArea, Point topLeft, Point topRight, Point bottomLeft, Point bottomRight) {

        Mat intersection            = getTableLinesIntersection(image);
        List<Rect> rects            = getTableCoordinates(intersection, NUM_OF_POINTS);
        List<Rect> rectCol1         = new ArrayList<>();
        List<Rect> rectCol2         = new ArrayList<>();
        List<Rect> rectCol3         = new ArrayList<>();

        Log.d(TAG, "Table intersections: " + rects.size());
        if (rects.size() != NUM_OF_POINTS) {
            List<BoxRect> emptyBoxes = new ArrayList<BoxRect>();
            return emptyBoxes;
        }

        List <Rect> sortedRect      = CVOperations.sortRects(rects);
        Log.d(TAG, "Table co-ordinates:" + sortedRect.toString());

        for (int i = 0; i < sortedRect.size(); i++) {
            if (i < NUM_OF_POINTS/3) {
                rectCol1.add(sortedRect.get(i));
            }
            if (i >= NUM_OF_POINTS/3 && i < (2*NUM_OF_POINTS)/3) {
                rectCol2.add(sortedRect.get(i));
            }
            if (i >= (2*NUM_OF_POINTS)/3) {
                rectCol3.add(sortedRect.get(i));
            }
        }

        List<Rect> sorted_rects1            = CVOperations.sortRects(rectCol1);
        List<Rect> sorted_rects2            = CVOperations.sortRects(rectCol2);
        List<Rect> sorted_rects3            = CVOperations.sortRects(rectCol3);

//        drawPOIPoints(frameImage, image, sorted_rects1, RED_COLOR, topLeft);
//        drawPOIPoints(frameImage, image, sorted_rects2, GREEN_COLOR, topLeft);
//        drawPOIPoints(frameImage, image,  sorted_rects3, BLUE_COLOR, topLeft);

        Log.d(TAG, "rect1: " + sorted_rects1.toString());
        Log.d(TAG, "rect2: " + sorted_rects2.toString());
        Log.d(TAG, "rect3: " + sorted_rects3.toString());

        List<BoxRect> boxes                 = BoxRect.getBoxRects(sorted_rects2, sorted_rects3);

        Log.d(TAG, "Numbers of column boxes: " + boxes.size() + " boxes : " + boxes.toString());
        drawPOIArea(frameImage, image, boxes, GREEN_COLOR, topLeft);

        return boxes;
    }

    public Mat getPOIMat(Mat image, BoxRect box) {
        Rect r      = box.getCropRect();
        Mat cropped;
        if (0 <= r.x
                && 0 <= r.width
                && r.x + r.width <= image.cols()
                && 0 <= r.y
                && 0 <= r.height
                && r.y + r.height <= image.rows()) {
            cropped = new Mat(image, r);
            return cropped;
        }
        else {
            return image;
        }

    }

    private final List<Mat>getPOIMats(Mat image, List<BoxRect> boxes) {
        List<Mat> mats = new ArrayList<>();

        for (int i = 0; i < boxes.size(); i++) {
            Rect r      = boxes.get(i).getCropRect();
            Mat cropped = new Mat(image, r);
            mats.add(cropped);
        }

        return mats;
    }

    private final void drawPOIArea(Mat frameImage, Mat image, List<BoxRect> boxes, Scalar color, Point tableTopLeft) {
        if (DEBUG) {
            for (int i = 0; i < boxes.size(); i++) {
                Rect r = boxes.get(i).getCropRect();
                if (0 <= r.x
                        && 0 <= r.width
                        && r.x + r.width <= image.cols()
                        && 0 <= r.y
                        && 0 <= r.height
                        && r.y + r.height <= image.rows()) {

                    Imgproc.rectangle(frameImage, new Point(r.x + tableTopLeft.x, r.y + tableTopLeft.y),
                            new Point(r.x + r.width + tableTopLeft.x, r.y + r.height + tableTopLeft.y), color, 2);

                    Mat cropped = new Mat(image, r);
//                    CVOperations.saveImage(cropped, "box_" + i, 3, false);
                }
            }
        }
    }

    private final void drawPOIPoints(Mat frameImage, Mat image, List<Rect> boxes, Scalar color, Point tableTopLeft) {
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
                            new Point(r.x + r.width + tableTopLeft.x, r.y + r.height + tableTopLeft.y), color, 5);
                }
            }
        }
    }

    private final Mat getTableLinesIntersection(Mat image) {
        int MAX_THRESHOLD_VALUE     = 255;
        int BLOCK_SIZE              = 15;
        int THRESHOLD_CONSTANT      = 0;
        int SCALE                   = 7;

        Mat gray_img                = new Mat();
        Imgproc.cvtColor(image, gray_img, Imgproc.COLOR_BGR2GRAY);

        Mat bw_img                  = new Mat();
        Core.bitwise_not(gray_img, gray_img);
        Imgproc.adaptiveThreshold(gray_img, bw_img, MAX_THRESHOLD_VALUE, Imgproc.ADAPTIVE_THRESH_MEAN_C, Imgproc.THRESH_BINARY, BLOCK_SIZE, THRESHOLD_CONSTANT);

        Mat hori_img                = new Mat();
        bw_img.copyTo(hori_img);
        int hori_size               = (int)(hori_img.rows() / SCALE);
        Mat hori_structure          = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(hori_size, 1));
        hori_img                    = isolateLines(hori_img, hori_structure);

        Mat vert_img                = new Mat();
        bw_img.copyTo(vert_img);
        int vert_size               = (int)(vert_img.cols() / SCALE);
        Mat vert_structure          = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(1, vert_size));
        vert_img                    = isolateLines(vert_img, vert_structure);

        Mat mask                    = new Mat();
        Core.add(hori_img, vert_img, mask);

        Mat hierarchy               = new Mat();
        List<MatOfPoint> contours   = new ArrayList<>();
        Imgproc.findContours(mask, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);
        Log.d(TAG, "found contours in table mask image: " + contours.size());

        Mat intersections           = new Mat();
        Core.bitwise_and(hori_img, vert_img, intersections);

        return intersections;
    }

    private final List<Rect> getTableCoordinates(Mat image, int numOfPoints) {
        List<Rect> rects            = new ArrayList<>();
        Mat hierarchy               = new Mat();
        List<MatOfPoint> contours   = new ArrayList<>();
        Imgproc.findContours(image, contours, hierarchy, Imgproc.RETR_CCOMP, Imgproc.CHAIN_APPROX_SIMPLE);
        Log.d(TAG, "found contours in entire image " + contours.size());
        if (contours.size() < numOfPoints) {
            return rects;
        }

        contours    = CVOperations.sortContours(contours, "topToBottom");
        for (int i = 0; i < contours.size(); i++) {
            Rect rect = Imgproc.boundingRect(contours.get(i));
            rects.add(rect);
        }

        return rects;
    }

    private final Mat isolateLines(Mat image, Mat element) {
        Imgproc.erode(image, image, element);
        Imgproc.dilate(image, image, element);
        return image;
    }

}
