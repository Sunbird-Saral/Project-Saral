package org.ekstep.saral.saralsdk.opencv;

import android.util.Log;

import org.ekstep.saral.saralsdk.commons.CVOperations;

import org.opencv.calib3d.Calib3d;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint2f;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

import java.util.ArrayList;
import java.util.List;

public class PageEdgeDetection {
    private static final String  TAG        = "SrlSDK::TableDetector";     
    private boolean DEBUG                   = false; 
    private double mROI                     = 0.0;
    private Point mTopLeft, mTopRight, mBottomLeft, mBottomRight;
    private List<Point> points = new ArrayList<Point>();

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

    public Mat processMat(Mat image,int minWidth,int minHeight,int detectionRadius) {

        Mat gray        = new Mat();
        Imgproc.Canny(image, gray, 30, 100);
        Mat hierarchy = new Mat();
        List<MatOfPoint> contours = new ArrayList<>();
        Imgproc.findContours(gray, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);

        double maxArea          = 0;
        int maxAreaContourIndex = 0;
        if (contours.size() > 0) {
            for (int i = 0; i < contours.size(); i++) {
                double contourArea = Imgproc.contourArea(contours.get(i));
                if (maxArea < contourArea) {                                
                    maxArea                 = contourArea;
                    maxAreaContourIndex     = i;
                }
            }       //gets biggest contour

            Rect r = Imgproc.boundingRect(contours.get(maxAreaContourIndex));       //get coordinates
            Imgproc.rectangle(image, new Point(r.x, r.y), new Point(r.x + r.width, r.y + r.height), new Scalar(255, 0, 0, 255), 2); //draw
            
            Point topLeft = new Point(r.x, r.y);
            Point topRight = new Point(r.x + r.width, r.y);
            Point bottomLeft = new Point(r.x, r.y + r.height);
            Point bottomRight = new Point(r.x + r.width, r.y + r.height);

            Point[] cornerPoints = new Point[4];
            cornerPoints[0] = topLeft;
            cornerPoints[1] = topRight;
            cornerPoints[2] = bottomLeft;
            cornerPoints[3] = bottomRight;
            MatOfPoint corners = new MatOfPoint();
            corners.fromArray(cornerPoints);
            List<Point> points = new ArrayList<Point>();
            for (int i = 0; i < corners.rows(); i++) {
                double[] point = corners.get(i, 0);
                points.add(new Point(point[0], point[1]));
            }                 
            if(detectionRadius > 0 && !hasLayoutDetectionCorners(image, corners,detectionRadius))
            {
                showFocusAlert(image);
                return null;
            }

            if (corners.rows() == 4) {
                Log.d(TAG, "Detected 4 corners. Sorting points...");        //added
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

                // distance 
                mROI        = (bottomRight.x - topLeft.x) * (bottomLeft.y - topRight.y);
                int minY        = Math.min((int)topLeft.y, (int)topRight.y);
                int maxY        = Math.max((int)bottomLeft.y, (int)bottomRight.y);
                int maxHeight   = maxY-minY;

                int minX        = Math.min((int)topLeft.x, (int)bottomLeft.x);
                int maxX        = Math.max((int)topRight.x, (int)bottomRight.x);
                int maxWidth    = maxX-minX;
                
                Rect rectCrop = new Rect((int)((int)topLeft.x+(int)bottomLeft.x)/2, (int)topLeft.y-5, maxWidth, maxHeight+10);
                Log.d(TAG, "Rect Width " + rectCrop.width+" Rect Height "+rectCrop.height);     //changed
                Log.d(TAG, "ROI Rect: " + rectCrop);        //added
                if(minWidth > 0 && minHeight > 0 && (rectCrop.width < minWidth || rectCrop.height < minHeight))
                {
                    showFocusAlert(image);
                    return null;
                }
               

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
                    if (DEBUG){
                        Log.d(TAG, "Detected corners: " + corners.rows());       //added
                        CVOperations.saveImage(croppedMat, "table", 3, false);
                    }
                    return croppedMat;
                }
            } 
            else {
                Log.d(TAG, "Not enough points detected. Showing focus alert.");
                showFocusAlert(image);
                return null;
            }
        }
        return null;
    }


    private final Mat cropROI(Mat image, Point topLeft, Point topRight, Point bottomLeft, Point bottomRight) {
        Mat capturedImage       = image.clone();
        Mat croppedImage        = homographicTransformation(capturedImage, topRight, bottomRight, topLeft, bottomLeft);
        return croppedImage;
    }

    private void showFocusAlert(Mat image) {
        Log.d(TAG, "Showing Focus Alert");              //added
        String text     = "Please focus the camera by moving up or down";
        Point position  = new Point(image.width()/6, image.height() / 2);
        Scalar color    = new Scalar(255, 0, 0);
        int font        = org.opencv.core.Core.FONT_HERSHEY_COMPLEX_SMALL;
        int scale       = 2;
        int thickness   = 3;
        Imgproc.putText(image, text, position, font, scale, color, thickness);
    }

    private final boolean hasLayoutDetectionCorners(Mat src, MatOfPoint corners, int detectionRadius) {
        boolean isValid = true;
        if (points.size() > 0) {
            for (int i = 0; i < points.size(); i++) {
                Point corner1 = points.get(i);
                for (int j = i + 1; j < points.size(); j++) {
                    Point corner2 = points.get(j);
                    double distance = Math.sqrt(Math.pow(corner2.x - corner1.x, 2) + Math.pow(corner2.y - corner1.y, 2));
                    if (distance < detectionRadius) {
                        isValid = false;
                        break;
                    }
                }
            }
        }
    
        // Return the validity status
        return isValid;
    }

    private final void drawPOIArea(Mat image, Point topLeft, Point topRight, Point bottomLeft, Point bottomRight) {
        if (DEBUG) {
            Imgproc.circle(image, topLeft, 10, new Scalar(255.0, 0.0, 0.0), 10);
            Imgproc.circle(image, topRight, 10, new Scalar(0.0, 255.0, 0.0), 10);
            Imgproc.circle(image, bottomLeft, 10, new Scalar(0.0, 0.0, 255.0), 10);
            Imgproc.circle(image, bottomRight, 10, new Scalar(255.0, 255.0, 0.0), 10);      //changed
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
