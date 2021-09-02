package com.up_saraldata.hwmodel;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.util.Log;

import com.google.firebase.ml.common.FirebaseMLException;
import com.google.firebase.ml.custom.FirebaseCustomLocalModel;
import com.google.firebase.ml.custom.FirebaseModelDataType;
import com.google.firebase.ml.custom.FirebaseModelInputOutputOptions;
import com.google.firebase.ml.custom.FirebaseModelInputs;
import com.google.firebase.ml.custom.FirebaseModelInterpreter;
import com.google.firebase.ml.custom.FirebaseModelInterpreterOptions;

import org.opencv.android.Utils;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfDouble;
import org.opencv.imgproc.Imgproc;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class HWClassifier {
    private static final String TAG             = "UP_Saral::HWClassifier";
    /**
     * Name of the model file hosted with Firebase.
     */
    private static final String HOSTED_MODEL_NAME = null;
    private static final String LOCAL_MODEL_ASSET = "trained_resnet_model_v2_10.tflite";//"digit_trained_model_resnet.tflite";

    /**
     * Dimensions of inputs.
     */
    private static final int DIM_BATCH_SIZE     = 1;
    private static final int DIM_PIXEL_SIZE     = 1;
    private static final int DIM_IMG_SIZE_X     = 28;
    private static final int DIM_IMG_SIZE_Y     = 28;

    /**
     * An instance of the driver class to run model inference with Firebase.
     */
    private FirebaseModelInterpreter                mInterpreter;

    /**
     * Data configuration of input & output data of model.
     */
    private FirebaseModelInputOutputOptions         mDataOptions;

    public PredictionListener                       predictionListener;

    public HWClassifier(Activity activity, PredictionListener listener) throws IOException {
        predictionListener  = listener;
    }

    public void initialize() {
        int[] inputDims = {DIM_BATCH_SIZE, DIM_IMG_SIZE_X, DIM_IMG_SIZE_Y, DIM_PIXEL_SIZE};
        int[] outputDims = {DIM_BATCH_SIZE, 11};
        try {
            int firebaseModelDataType = FirebaseModelDataType.FLOAT32;
            mDataOptions =
                    new FirebaseModelInputOutputOptions.Builder()
                            .setInputFormat(0, firebaseModelDataType, inputDims)
                            .setOutputFormat(0, firebaseModelDataType, outputDims)
                            .build();

            FirebaseCustomLocalModel localSource = new FirebaseCustomLocalModel.Builder()
                    .setAssetFilePath(LOCAL_MODEL_ASSET)
                    .build();

            FirebaseModelInterpreterOptions options =
                    new FirebaseModelInterpreterOptions.Builder(localSource).build();
            mInterpreter = FirebaseModelInterpreter.getInstance(options);
            predictionListener.OnModelLoadStatus("model loading successful");
        } catch (FirebaseMLException e) {
            predictionListener.OnModelLoadStatus("model loading failed");
            e.printStackTrace();
        }
    }

    public void classifyMat(Mat mat, String id) {
        if(mInterpreter != null) {
            //For Old Modal
//            Mat processedMat    = preprocessMatForModel(mat);
            //For New Modal
            Mat processedMat = preprocessMatForNewModal(mat);
            runInference(convertMattoTfLiteInput(processedMat), id);
        }
    }

    private Mat preprocessMatForNewModal(Mat mat) {
        Mat gray_img = new Mat();
        Imgproc.cvtColor(mat, gray_img, Imgproc.COLOR_BGR2GRAY);
        Mat matFinal        = new Mat();

        //img = np.array(img,dtype=np.float32) / 255.0 -- Python
        gray_img.convertTo(matFinal, CvType.CV_32FC3, 1/255.0); // -- Java
        return matFinal;
    }

    private Mat preprocessMatForModel(Mat mat) {
//        Mat rotatedMat = rotateMat(mat);

        //mean and std deviation
        Mat gray_img        = new Mat();
        Imgproc.cvtColor(mat, gray_img, Imgproc.COLOR_BGR2GRAY);
        Core.bitwise_not(gray_img, gray_img);

        MatOfDouble mu      = new MatOfDouble();
        MatOfDouble sigma   = new MatOfDouble();
        Core.meanStdDev(gray_img, mu, sigma);
        Mat meanMat         =  new Mat();
        Core.subtract(gray_img, mu, meanMat);
        Mat matFinal        = new Mat();
        Core.divide(meanMat, sigma, matFinal);
        return matFinal;
    }

    private Mat rotateMat(Mat data) {
        Bitmap resultBitmap = Bitmap.createBitmap(data.cols(), data.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(data, resultBitmap);

        Matrix matrix       = new Matrix();
        matrix.setRotate(90F);
        Bitmap bmRotated    = Bitmap.createBitmap(resultBitmap, 0, 0, resultBitmap.getWidth(), resultBitmap.getHeight(), matrix, true);
        Mat rotatedMat      = new Mat();
        Utils.bitmapToMat(bmRotated, rotatedMat);
        return rotatedMat;
    }

    private ByteBuffer convertMattoTfLiteInput(Mat mat) {
        int bytesPerChannel     = 4;
        ByteBuffer imgData      = ByteBuffer.allocateDirect(bytesPerChannel * DIM_BATCH_SIZE * DIM_IMG_SIZE_X * DIM_IMG_SIZE_Y * DIM_PIXEL_SIZE);
        imgData.order(ByteOrder.nativeOrder());
        imgData.rewind();

        for (int i = 0; i < DIM_IMG_SIZE_Y; ++i) {
            for (int j = 0; j < DIM_IMG_SIZE_X; ++j) {
                imgData.putFloat((float)mat.get(i,j)[0]);
            }
        }
        return imgData;
    }

    private void runInference(ByteBuffer data, String id) {

        if (mInterpreter !=  null) {
            try {
                FirebaseModelInputs inputs          = new FirebaseModelInputs.Builder().add(data).build();
                mInterpreter.run(inputs, mDataOptions)
                        .addOnSuccessListener(result -> {
                            float[][] output        = result.getOutput(0);
                            float[] probabilities   = output[0];
                            int digit               = getMarksValue(probabilities);
                            predictionListener.OnPredictionSuccess(digit, id);
                        })
                        .addOnFailureListener(e -> {
                            e.printStackTrace();
                            Log.e(TAG, e.getMessage());
                            predictionListener.OnPredictionFailed("PREDICTION FAILED");
                        });

            } catch (FirebaseMLException e) {
                e.printStackTrace();
                predictionListener.OnPredictionFailed("INVALID INTERPRETER");
            }
        }
    }

    private int getMarksValue(float[] arr) {
        int index   = 0;
        double max  = arr[0];

        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
                index = i;
            }
        }
        return index;
    }
}
