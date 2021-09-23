package org.ekstep.saral.saralsdk.opencv;

import android.util.Log;

import org.ekstep.saral.saralsdk.commons.CVOperations;

import org.opencv.calib3d.Calib3d;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint2f;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

import java.util.ArrayList;
import java.util.List;

public class TableCornerCirclesDetection {
    private static final String  TAG        = "SrlSDK::TableDetector";
    private boolean DEBUG                   = false;
    private double mROI                     = 0.0;
    private Point mTopLeft, mTopRight, mBottomLeft, mBottomRight;

    public Point getmTopLeft() {
        return mTopLeft;
    }

    public Point getmTopRight() {
        return mTopRight;
    }

    public Point getmBottomLeft() {
        return mBottomLeft;
    }

    public Point getmBottomRight() {
        return mBottomRight;
    }


    public double getmROI() {
        return mROI;
    }

    public TableCornerCirclesDetection(boolean debug){
        DEBUG = debug;
    }

    public Mat processMat(Mat image) {

        Mat gray        = new Mat();
        Imgproc.cvtColor(image, gray, Imgproc.COLOR_BGR2GRAY);
        Imgproc.medianBlur(gray, gray, 5);
        Mat circles     = new Mat();
        Imgproc.HoughCircles(gray, circles, Imgproc.CV_HOUGH_GRADIENT,1.5,400.0, 100.0, 30.0, 15, 20);

        /**
         * Draw the detected circles.
         */
        if (DEBUG)
            drawDetectedCircles(image, circles);

        if (circles.cols() > 0) {
            Point topLeft, topRight;
            Point bottomLeft, bottomRight;

            List<Point> points = CVOperations.getCirclesPoint(circles);
            if (points.size() == 4) {
                CVOperations.sortPointListFromLeft(points);
                List<Point> leftPoints = new ArrayList<Point>();
                List<Point> rightPoints = new ArrayList<Point>();

                leftPoints.add(0, points.get(0));
                leftPoints.add(1, points.get(1));

                rightPoints.add(0, points.get(2));
                rightPoints.add(1, points.get(3));

                CVOperations.sortPointListFromTop(leftPoints);
                CVOperations.sortPointListFromTop(rightPoints);

                topLeft     = leftPoints.get(0);
                topRight    = rightPoints.get(0);
                bottomLeft  = leftPoints.get(1);
                bottomRight = rightPoints.get(1);

                mROI        = (bottomRight.x - topLeft.x) * (bottomLeft.y - topRight.y);
                int minY        = Math.min((int)topLeft.y, (int)topRight.y);
                int maxY        = Math.max((int)bottomLeft.y, (int)bottomRight.y);
                int maxHeight   = maxY-minY;

                int minX        = Math.min((int)topLeft.x, (int)bottomLeft.x);
                int maxX        = Math.max((int)topRight.x, (int)bottomRight.x);
                int maxWidth    = maxX-minX;

                Rect rectCrop = new Rect((int)((int)topLeft.x+(int)bottomLeft.x)/2, (int)topLeft.y-5, maxWidth, maxHeight+10);
                if (0 <= rectCrop.x
                        && 0 <= rectCrop.width
                        && rectCrop.x + rectCrop.width <= image.cols()
                        && 0 <= rectCrop.y
                        && 0 <= rectCrop.height
                        && rectCrop.y + rectCrop.height <= image.rows()) {

                    mTopLeft        = topLeft;
                    mBottomLeft     = bottomLeft;
                    mTopRight       = topRight;
                    mBottomRight    = bottomRight;

                    Log.d(TAG, "Detected ROI Area: " + mROI);
                    drawPOIArea(image, topLeft, topRight, bottomLeft, bottomRight);

                    Mat croppedMat  = cropROI(image, topLeft, topRight, bottomLeft, bottomRight);
                    if (DEBUG)
                        CVOperations.saveImage(croppedMat, "table", 3, false);
                    return croppedMat;
                }
            }
        }
        return null;
    }

    private final Mat cropROI(Mat image, Point topLeft, Point topRight, Point bottomLeft, Point bottomRight) {
        Mat capturedImage       = image.clone();
        Mat croppedImage        = homographicTransformation(capturedImage, topRight, bottomRight, topLeft, bottomLeft);
        return croppedImage;
    }

    private final void drawDetectedCircles(Mat src, Mat circles) {
        if (circles.cols() > 0) {
            for (int x = 0; x < circles.cols(); x++) {
                double[] c = circles.get(0, x);
                Point center = new Point(Math.round(c[0]), Math.round(c[1]));
                // circle center
                Imgproc.circle(src, center, 1, new Scalar(0,100,100), 3, 8, 0 );
                // circle outline
                int radius = (int) Math.round(c[2]);
                Imgproc.circle(src, center, radius, new Scalar(255,0,255), 3, 8, 0 );
            }
        }
    }

    private final void drawPOIArea(Mat image, Point topLeft, Point topRight, Point bottomLeft, Point bottomRight) {
        if (DEBUG) {
            Imgproc.circle(image, topLeft, 10, new Scalar(255.0, 0.0, 0.0), 10);
            Imgproc.circle(image, topRight, 10, new Scalar(0.0, 255.0, 0.0), 10);
            Imgproc.circle(image, bottomLeft, 10, new Scalar(0.0, 0.0, 255.0), 10);
            Imgproc.circle(image, bottomRight, 10, new Scalar(255.0, 255.0, 0.0), 10);
        }
        Imgproc.line(image, topLeft,    topRight,       new Scalar(0.0, 255.0, 0.0), 5);
        Imgproc.line(image, bottomLeft, bottomRight,    new Scalar(0.0, 255.0, 0.0), 5);
        Imgproc.line(image, topLeft,    bottomLeft,     new Scalar(0.0, 255.0, 0.0), 5);
        Imgproc.line(image, topRight,   bottomRight,    new Scalar(0.0, 255.0, 0.0), 5);
    }

    private final Mat cropImage(Mat image, Point topLeft, Point topRight, Point bottomRight, Point bottomLeft) {

        Rect roi = new Rect((int)Math.max(topLeft.x, bottomLeft.x),
                (int)Math.max(topLeft.y, bottomLeft.y),
                (int)Math.abs(bottomLeft.x - topLeft.x),
                (int)Math.abs(bottomRight.y - topRight.y));

        Mat cropped = new Mat(image, roi);
        return cropped;
    }

    private final Mat homographicTransformation(Mat imgCloned, Point topRightOriginal, Point bottomRightOriginal, Point topLeftOriginal, Point bottomLeftOriginal) {

        ArrayList pointSource = new ArrayList();
        pointSource.add(new Point(topLeftOriginal.x, topLeftOriginal.y));
        pointSource.add(new Point(topRightOriginal.x, topRightOriginal.y));
        pointSource.add(new Point(bottomRightOriginal.x, bottomRightOriginal.y));
        pointSource.add(new Point(bottomLeftOriginal.x, bottomLeftOriginal.y));
        Size size = new Size(640, 480);

        Mat destinationMat = new Mat(size, CvType.CV_8UC3);

        ArrayList pointDestination = new ArrayList();
        pointDestination.add(new Point(0.0D, 0.0D));
        pointDestination.add(new Point(size.width - (double)1, 0.0D));
        pointDestination.add(new Point(size.width - (double)1, size.height - (double)1));
        pointDestination.add(new Point(0.0D, size.height - (double)1));
        MatOfPoint2f sourcePoint2f = new MatOfPoint2f();
        sourcePoint2f.fromList(pointSource);
        MatOfPoint2f destinationPoint2f = new MatOfPoint2f();
        destinationPoint2f.fromList(pointDestination);
        Mat he = Calib3d.findHomography(sourcePoint2f, destinationPoint2f);
        Imgproc.warpPerspective(imgCloned, destinationMat, he, size);
        return destinationMat;
    }
}
