package org.ekstep.saral.saralsdk.opencv;

import android.util.Log;

import org.ekstep.saral.saralsdk.commons.CVOperations;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

import java.util.ArrayList;
import java.util.List;

public class ExtractRollRow {
    private static final String  TAG                = "SrlSDK::Roll";
    private boolean DEBUG                           = false;
    private static final int NUM_OF_CONTOURS        = 7;
    private static final Scalar RED_COLOR           = new Scalar(255.0, 0.0, 0.0);
    private static final Scalar GREEN_COLOR         = new Scalar(0.0, 255.0, 0.0);
    private static final Scalar BLUE_COLOR          = new Scalar(0.0, 0.0, 255.0);
    private List <Mat>  mMats                       = null;

    public List<Mat> getmMats() {
        return mMats;
    }

    public static int getMaxRollRowSize() {
        return NUM_OF_CONTOURS;
    }

    public ExtractRollRow(boolean debug) {
        DEBUG = debug;
    }

    public boolean processMat(Mat frameImage, Mat image, Point tableTopLeft, Point rowTopLeft) {

//        List<Rect> boxes    = extractCharacters(image, 6, 1);
        List<Rect> boxes    = extractCharacters_V1(image, 0, 0);

        if (boxes.size() != NUM_OF_CONTOURS) {
            return false;
        }

        mMats               = new ArrayList<>(getResizedMats(image, CVOperations.sortRectsTOLeft(boxes)));

        Point topLeft       = new Point(tableTopLeft.x + rowTopLeft.x, tableTopLeft.y + rowTopLeft.y);
        drawPOIArea(frameImage, image, boxes, RED_COLOR, topLeft);
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
                }
            }
        }
    }

    private List<Rect> extractCharacters(Mat image, int max_width, int max_height) {
        List<Rect> rects    = new ArrayList<>();
        Mat gray            = new Mat();

        Imgproc.cvtColor(image, gray, Imgproc.COLOR_BGR2GRAY);
        Mat blurred = new Mat();
        Imgproc.GaussianBlur(gray, blurred, new Size(3, 3), 0);

        Mat bw_img = new Mat();
        Imgproc.adaptiveThreshold(blurred, bw_img, 255, Imgproc.ADAPTIVE_THRESH_MEAN_C, Imgproc.THRESH_BINARY, 51, 9);
        Core.bitwise_not(bw_img, bw_img);

        Mat hierarchy = new Mat();
        List<MatOfPoint> contours = new ArrayList<>();
        Imgproc.findContours(bw_img, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_TC89_KCOS);

        Log.e(TAG, "extractCharacters :: contours detected " + contours.size());
        for (int idx = 0; idx < contours.size(); idx++) {
            Rect rect   = Imgproc.boundingRect(contours.get(idx));
            float ar    = (float)rect.width / (float)rect.height;
            Log.d(TAG, "extractCharacters :: rect: " + rect.toString() + " image width:: " + image.cols() + " image height ::" + image.rows() + " ar: " +  ar);

            if (rect.x < 5) {
                continue;
            }

            if (rect.width > max_width && rect.height > max_height && ar >= 0.1 && ar <= 0.999) {
                Log.d(TAG, "extractCharacters :: adding width " + rect.width + " height " + rect.height);
                rects.add(rect);
            }
        }
        Log.e(TAG, "extractCharacters :: contours " + contours.size() + " filtered rects: " + rects.size());
        return CVOperations.sortRects(rects);
    }

    private List<Rect> extractCharacters_V1(Mat image, int max_width, int max_height) {
        Rect b1 = new Rect(20+0*38, 10, 38, 45);
        Rect b2 = new Rect(20+1*38, 10, 38, 45);
        Rect b3 = new Rect(20+2*38, 10, 38, 45);
        Rect b4 = new Rect(20+3*38, 10, 38, 45);
        Rect b5 = new Rect(20+4*38, 10, 38, 45);
        Rect b6 = new Rect(20+5*38, 10, 38, 45);
        Rect b7 = new Rect(20+6*38, 10, 38, 45);

        List <Rect> rects = new ArrayList<>();
        rects.add(b1);
        rects.add(b2);
        rects.add(b3);
        rects.add(b4);
        rects.add(b5);
        rects.add(b6);
        rects.add(b7);
        return rects;
    }

    private final List<Mat> getResizedMats(Mat image, List<Rect> rects) {
        int IMAGE_BUFFER    = 4;
        List <Mat> mats   = new ArrayList<Mat>();
        for (int j = 0; j < rects.size(); j++) {
            Rect rect   = rects.get(j);
            /**
             * crop box image as per the received contours rectangle. Also added 4 extra pixels of padding.
             */
            if (0 <= rect.x + IMAGE_BUFFER
                    && 0 <= rect.width
                    && rect.x + IMAGE_BUFFER + rect.width - 2 * IMAGE_BUFFER <= image.cols()
                    && 0 <= rect.y
                    && 0 <= rect.height
                    && rect.y + IMAGE_BUFFER + rect.height - 2 * IMAGE_BUFFER <= image.rows()) {
                Mat ROI = image.submat(rect.y + IMAGE_BUFFER, rect.y + IMAGE_BUFFER + rect.height - 1 * IMAGE_BUFFER,
                        rect.x + IMAGE_BUFFER,
                        rect.x + IMAGE_BUFFER + rect.width - 2 * IMAGE_BUFFER);

                Mat resized = resizeImage(ROI, rect);
                mats.add(resized);
//                CVOperations.saveImage(resized, "digi_"+j, 3, false);
            }
        }
        return mats;
    }

    /**
     * Resize the rect to 28x28 size.
     */
    private final Mat resizeImage(Mat image, Rect r) {
        int MODEL_IMAGE_WIDTH   = 28;
        int MODEL_IMAGE_HEIGHT  = 28;
        int width               = 0;
        int height              = 0;

        if ((image.height() > MODEL_IMAGE_HEIGHT)) {
            height = image.height();
        } else {
            height = MODEL_IMAGE_HEIGHT;
        }

        if ((image.width() > MODEL_IMAGE_WIDTH)) {
            width = image.width();
        } else {
            width = MODEL_IMAGE_WIDTH;
        }

        if (width > height) {
            height  = width;
        } else {
            width   = height;
        }
        Log.d(TAG, "received image :: width: " + image.width() + " height: " + image.height());
        Log.d(TAG, "resized image  :: width: " + width + " height: " + height);

        /**
         * 1. create a Mat with dimension width x height
         * 2. copy actual image
         * 3. Resize to 28x28
         */
        Mat m   = new Mat();
        Mat m1  = new Mat(new Size(width, height), CvType.CV_8UC3);
        image.copyTo(m1);
        Imgproc.resize(m1, m, new Size(MODEL_IMAGE_WIDTH, MODEL_IMAGE_HEIGHT));
        return m;
    }

}
