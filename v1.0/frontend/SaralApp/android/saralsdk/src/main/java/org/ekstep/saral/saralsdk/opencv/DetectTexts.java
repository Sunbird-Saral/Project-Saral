package org.ekstep.saral.saralsdk.opencv;

import android.util.Log;

import org.opencv.core.CvType;
import org.opencv.core.KeyPoint;
import org.opencv.core.Mat;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Rect;
import org.opencv.core.Scalar;
import org.opencv.imgproc.Imgproc;
import org.opencv.features2d.MSER;

import java.util.ArrayList;
import java.util.List;

public class DetectTexts {
    private static final String  TAG                = "SrlSDK::Text";
    private boolean DEBUG                           = false;
    private static final Scalar RED_COLOR           = new Scalar(255.0, 0.0, 0.0);
    private static final Scalar GREEN_COLOR         = new Scalar(0.0, 255.0, 0.0);

    public DetectTexts(boolean debug) {
        DEBUG = debug;
    }

    public void processMat(Mat image) {
        Mat gray            = new Mat();
        Imgproc.cvtColor(image, gray, Imgproc.COLOR_BGR2GRAY);

        MatOfKeyPoint keypoint = new MatOfKeyPoint();
        List<KeyPoint> listpoint;
        KeyPoint kpoint;
        Mat mask = Mat.zeros(gray.size(), CvType.CV_8UC1);
        int rectanx1;
        int rectany1;
        int rectanx2;
        int rectany2;
        int imgsize = gray.height() * gray.width();
        Scalar zeos = new Scalar(0, 0, 0);

        List<MatOfPoint> contour2 = new ArrayList<MatOfPoint>();
        Mat kernel = new Mat(1, 50, CvType.CV_8UC1, Scalar.all(255));
        Mat morbyte = new Mat();
        Mat hierarchy = new Mat();

        Rect rectan3;
        //
        MSER detector = MSER.create();
        detector.detect(gray, keypoint);
        listpoint = keypoint.toList();
        Log.d(TAG, "List point : " + listpoint.size());

        //
        for (int ind = 0; ind < listpoint.size(); ind++) {
            kpoint = listpoint.get(ind);
            rectanx1 = (int) (kpoint.pt.x - 0.5 * kpoint.size);
            rectany1 = (int) (kpoint.pt.y - 0.5 * kpoint.size);
            rectanx2 = (int) (kpoint.size);
            rectany2 = (int) (kpoint.size);
            if (rectanx1 <= 0)
                rectanx1 = 1;
            if (rectany1 <= 0)
                rectany1 = 1;
            if ((rectanx1 + rectanx2) > gray.width())
                rectanx2 = gray.width() - rectanx1;
            if ((rectany1 + rectany2) > gray.height())
                rectany2 = gray.height() - rectany1;
            Rect rectant = new Rect(rectanx1, rectany1, rectanx2, rectany2);
            try {
                Mat roi = new Mat(mask, rectant);
                roi.setTo(RED_COLOR);
            } catch (Exception ex) {
                Log.d(TAG, "mat roi error " + ex.getMessage());
            }
        }

        Imgproc.morphologyEx(mask, morbyte, Imgproc.MORPH_DILATE, kernel);
        Imgproc.findContours(morbyte, contour2, hierarchy,
                Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_NONE);
        Log.d(TAG, "total contours : " + contour2.size());

        for (int ind = 0; ind < contour2.size(); ind++) {
            rectan3 = Imgproc.boundingRect(contour2.get(ind));
            rectan3 = Imgproc.boundingRect(contour2.get(ind));
            if (rectan3.area() > 0.5 * imgsize || rectan3.area() < 100
                    || rectan3.width / rectan3.height < 2) {
                Mat roi = new Mat(morbyte, rectan3);
                roi.setTo(zeos);
                Imgproc.rectangle(image, rectan3.br(), rectan3.tl(), GREEN_COLOR);
            } else
                Imgproc.rectangle(image, rectan3.br(), rectan3.tl(), RED_COLOR);
        }
    }
}
