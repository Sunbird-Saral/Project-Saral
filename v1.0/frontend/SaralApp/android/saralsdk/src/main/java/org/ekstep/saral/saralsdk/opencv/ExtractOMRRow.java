package org.ekstep.saral.saralsdk.opencv;

import android.util.Log;

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

public class ExtractOMRRow {
    private static final String  TAG                = "SrlSDK::OMR";
    private boolean DEBUG                           = false;
    private static final int NUM_OF_CONTOURS        = 6;
    private static final Scalar RED_COLOR           = new Scalar(255.0, 0.0, 0.0);
    private static final Scalar GREEN_COLOR         = new Scalar(0.0, 255.0, 0.0);
    private static final Scalar BLUE_COLOR          = new Scalar(0.0, 0.0, 255.0);
    private List<Rect>  mFilteredRects              = null;

    public String getmShadedIndex() {
        return mShadedIndex;
    }

    private String mShadedIndex                     = null;

    public ExtractOMRRow(boolean debug) {
        DEBUG = debug;
    }

    public boolean processMat(Mat frameImage, Mat image, Point tableTopLeft, Point rowTopLeft) {
        mShadedIndex = getShadedCircleV1(image);
        if (mShadedIndex == null) {
            return false;
        }
        Point topLeft       = new Point(tableTopLeft.x + rowTopLeft.x, tableTopLeft.y + rowTopLeft.y);
        drawPOIArea(frameImage, image, mFilteredRects, RED_COLOR, topLeft);
        return true;
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
//                    CVOperations.saveImage(cropped, "char_" + i, 3, false);
                }
            }
        }
    }

    private String  getShadedCircleV1(Mat image) {
        List<MatOfPoint> filteredContours   = new ArrayList<>();
        mFilteredRects                      = new ArrayList<>();

        Mat gray                            = new Mat();

        Imgproc.cvtColor(image, gray, Imgproc.COLOR_BGR2GRAY);
        Mat blurred = new Mat();
        Imgproc.GaussianBlur(gray, blurred, new Size(3, 3), 0);

        Mat canny   = new Mat();
        Imgproc.Canny(blurred, canny, 80, 100);

        Mat bw_img = new Mat();
        Imgproc.adaptiveThreshold(blurred, bw_img, 255, Imgproc.ADAPTIVE_THRESH_MEAN_C, Imgproc.THRESH_BINARY, 51, 0);
        Core.bitwise_not(bw_img, bw_img);

        Mat hierarchy = new Mat();
        List<MatOfPoint> contours = new ArrayList<>();
        Imgproc.findContours(bw_img, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);

        Log.d(TAG, "getShadedCircle:: found contours: " + contours.size());
        for(int i = 0; i < contours.size(); i++) {
            Rect rect   = Imgproc.boundingRect(contours.get(i));
            float ar    = (float)rect.width / (float)rect.height;
            if (rect.width > 20 && rect.height > 20 && ar >= 0.80000 && ar <= 1.1000) {
                mFilteredRects.add(rect);
                filteredContours.add(contours.get(i));
            }
        }
        Log.e(TAG, "getShadedCircle :: contours " + contours.size() + " filtered rects: " + mFilteredRects.size());
        if (mFilteredRects.size() != NUM_OF_CONTOURS) {
            return null;
        }
        int shadedIndex    = getContoursIndex(bw_img, CVOperations.sortContours(filteredContours, "leftToRight"));
        Log.d(TAG, "getShadedCircle :: shadedIndex :" + shadedIndex);

        return new Integer(shadedIndex).toString();
    }

    private int getContoursIndex(Mat image, List<MatOfPoint> contours) {
        int array[]         = new int[NUM_OF_CONTOURS];

        for (int i = 0; i < contours.size(); i++) {
            Rect rectCrop   = Imgproc.boundingRect(contours.get(i));
            Mat imageROI    = image.submat(rectCrop);
            int total       = Core.countNonZero(imageROI);
            array[i]        = total;
            double pixel    = total / Imgproc.contourArea(contours.get(i))*100;
        }
        return getIndexOfLargest(array);
    }

    private int getIndexOfLargest(int[] array) {
        if ( array == null || array.length == 0 ) return -1; // null or empty
        int largest = 0;
        for ( int i = 1; i < array.length; i++ ) {
            if ( array[i] > array[largest] ) largest = i;
        }
        return largest;
    }
}
