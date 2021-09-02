package com.up_saraldata.opencv;

import android.util.Log;

import com.up_saraldata.commons.CVOperations;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfDouble;
import org.opencv.imgproc.Imgproc;

public class BlurDetection {
    private static final String  TAG                = "UP_Saral::DetectShaded";
    private boolean DEBUG                           = false;
    private static final double BLUR_THRESHOLD      = 30.0;

    public BlurDetection(boolean debug){
        DEBUG = debug;
    }

    public boolean detectBlur(Mat img) {
        boolean valid = false;
        Mat gray = new Mat();
        Imgproc.cvtColor(img, gray, Imgproc.COLOR_BGR2GRAY);

        Mat lap = new Mat();
        Imgproc.Laplacian(gray, lap, CvType.CV_64F);

        MatOfDouble mean = new MatOfDouble ();
        MatOfDouble std = new MatOfDouble();

        Core.meanStdDev(lap, mean, std);
        double value = std.get(0,0)[0];
        if(value <= BLUR_THRESHOLD) {
            valid = true;
        }

        return valid;
    }
}
