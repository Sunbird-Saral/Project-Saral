package org.ekstep.saral.saralsdk.opencv;

import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.Scalar;
import org.opencv.imgproc.Imgproc;

import java.util.ArrayList;
import java.util.List;

public class DetectEdges {
    private static final String  TAG                = "SrlSDK::Edge";
    private boolean DEBUG                           = false;
    private static final Scalar RED_COLOR           = new Scalar(255.0, 0.0, 0.0);

    public DetectEdges(boolean debug) {
        DEBUG = debug;
    }

    public void processMat(Mat image) {
        Mat gray            = new Mat();
        Imgproc.cvtColor(image, gray, Imgproc.COLOR_BGR2GRAY);
        Imgproc.Canny(gray, gray, 80, 100);

        Mat hierarchy = new Mat();
        List<MatOfPoint> contours = new ArrayList<>();
        Imgproc.findContours(gray, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_NONE);

        double maxArea          = 0;
        int maxAreaContourIndex = 0;
        if (contours.size() > 0) {
            for (int i = 0; i < contours.size(); i++) {
                double contourArea = Imgproc.contourArea(contours.get(i));
                if (maxArea < contourArea) {
                    maxArea                 = contourArea;
                    maxAreaContourIndex     = i;
                }
            }

            Rect r = Imgproc.boundingRect(contours.get(maxAreaContourIndex));
            Imgproc.rectangle(image, new Point(r.x, r.y), new Point(r.x + r.width, r.y + r.height), new Scalar(255, 0, 0, 255), 2);
        }
    }
}
