package org.ekstep.saral.saralsdk.hwmodel;

import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.ml.common.FirebaseMLException;
import com.google.firebase.ml.common.modeldownload.FirebaseModelDownloadConditions;
import com.google.firebase.ml.common.modeldownload.FirebaseModelManager;
import com.google.firebase.ml.custom.FirebaseCustomLocalModel;
import com.google.firebase.ml.custom.FirebaseCustomRemoteModel;
import com.google.firebase.ml.custom.FirebaseModelDataType;
import com.google.firebase.ml.custom.FirebaseModelInputOutputOptions;
import com.google.firebase.ml.custom.FirebaseModelInterpreter;
import com.google.firebase.ml.custom.FirebaseModelInterpreterOptions;
//import com.google.firebase.ml.vision.FirebaseVision;
//import com.google.firebase.ml.vision.common.FirebaseVisionImage;
//import com.google.firebase.ml.vision.common.FirebaseVisionImageMetadata;
//import com.google.firebase.ml.vision.text.FirebaseVisionText;
//import com.google.firebase.ml.vision.text.FirebaseVisionTextRecognizer;

import org.jetbrains.annotations.NotNull;
import org.opencv.android.Utils;
import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.MatOfDouble;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;

import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.Base64;

import com.google.mlkit.common.MlKitException;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;

public class HWBlockLettersClassifier {
    private static final String TAG             = "SrlSDK::HWBlockLettersClassify";
    private static HWBlockLettersClassifier mInstance       = null;

    /**
     * Name of the model file hosted with Firebase.
     */
    private static final String HOSTED_MODEL_NAME = null;
    // private static final String LOCAL_MODEL_ASSET = "model_letter_digits_finetune_18_07_22_epoch_15.tflite";
    private static final String LOCAL_MODEL_ASSET = "saral_freetext_model.tflite";
    private static final String FB_REMOTE_MODEL   = "saral_freetext_model.tflite";
    /**
     * Dimensions of inputs.
     */
    private static final int DIM_BATCH_SIZE     = 1;
    private static final int DIM_PIXEL_SIZE     = 1;
    private static final int DIM_IMG_SIZE_X     = 200;
    private static final int DIM_IMG_SIZE_Y     = 100;
    private Context context;

    /**
     * An instance of the driver class to run model inference with Firebase.
     */
    private FirebaseModelInterpreter                mInterpreter, downloadInterpreter;

    /**
     * Data configuration of input & output data of model.
     */
    private FirebaseModelInputOutputOptions         mDataOptions;

    public TextPredictionListener                       predictionListener;

    public static HWBlockLettersClassifier getInstance() {
        if (mInstance == null) {
            mInstance   = new HWBlockLettersClassifier();
        }
        return mInstance;
    }

    private HWBlockLettersClassifier() {
    }

    public boolean isInitialized() {
        if (mInterpreter != null || downloadInterpreter != null) {
            return true;
        }
        return false;
    }

    public void HWBlockLettersClassifierCallback(TextPredictionListener listener) throws IOException {
        predictionListener  = listener;
    }

    public void setPredictionListener(TextPredictionListener listener) {
        predictionListener  = listener;
    }

    public boolean isModelAvailable() {
        if (mInterpreter == null && downloadInterpreter == null) {
            return false;
        }
        return true;
    }

    public void initialize(HWBlockLettersClassifierStatusListener listener, boolean isFBDownloadEnable, Context context) {
        this.context = context;
        int[] inputDims = {DIM_BATCH_SIZE, DIM_IMG_SIZE_Y, DIM_IMG_SIZE_X, DIM_PIXEL_SIZE};
        int[] outputDims = {DIM_BATCH_SIZE, 48};
        try {
            int firebaseModelDataType = FirebaseModelDataType.FLOAT32;
            mDataOptions =
                    new FirebaseModelInputOutputOptions.Builder()
                            .setInputFormat(0, firebaseModelDataType, inputDims)
                            .setOutputFormat(0, firebaseModelDataType, outputDims)
                            .build();

            if (!isFBDownloadEnable) {
                localModelAsset(listener,context);
            }else {
                FirebaseCustomRemoteModel remoteModel =
                        new FirebaseCustomRemoteModel.Builder(FB_REMOTE_MODEL).build();
                FirebaseModelManager.getInstance().getLatestModelFile(remoteModel)
                        .addOnCompleteListener(new OnCompleteListener<File>() {
                            @Override
                            public void onComplete(@NonNull Task<File> task) {
                                File modelFile = task.getResult();
                                if (modelFile != null) {
                                    FirebaseModelInterpreterOptions options =
                                            new FirebaseModelInterpreterOptions.Builder(remoteModel).build();
                                    try {
                                        downloadInterpreter = FirebaseModelInterpreter.getInstance(options);
                                    } catch (FirebaseMLException e) {
                                        e.printStackTrace();
                                    }
                                    listener.OnModelLoadSuccess("firebase model loaded from local successful");
                                } else {
                                    FirebaseModelDownloadConditions conditions = new FirebaseModelDownloadConditions.Builder()
                                            .requireWifi()
                                            .build();
                                    FirebaseModelManager.getInstance().download(remoteModel, conditions)
                                            .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                @Override
                                                public void onSuccess(Void unused) {
                                                    FirebaseModelInterpreterOptions options =
                                                            new FirebaseModelInterpreterOptions.Builder(remoteModel).build();
                                                    try {
                                                        downloadInterpreter = FirebaseModelInterpreter.getInstance(options);
                                                    } catch (FirebaseMLException e) {
                                                        e.printStackTrace();
                                                    }
                                                    listener.OnModelLoadSuccess("model loaded from firebase successful");
                                                }
                                            }).addOnFailureListener(new OnFailureListener() {
                                        @Override
                                        public void onFailure(@NonNull @NotNull Exception e) {
                                            try {
                                                localModelAsset(listener,context);
                                            } catch (FirebaseMLException firebaseMLException) {
                                                firebaseMLException.printStackTrace();
                                            }
                                        }
                                    });
                                }
                            }
                        });
            }
        } catch (FirebaseMLException e) {
            listener.OnModelLoadError("model loading failed");
            e.printStackTrace();
        }
    }

    public void localModelAsset (HWBlockLettersClassifierStatusListener listener, Context context) throws FirebaseMLException {
        boolean hasFile = isAssetExists(LOCAL_MODEL_ASSET,context);
        if (hasFile){
            FirebaseCustomLocalModel localSource = new FirebaseCustomLocalModel.Builder()
                    .setAssetFilePath(LOCAL_MODEL_ASSET)
                    .build();
            FirebaseModelInterpreterOptions options =
                    new FirebaseModelInterpreterOptions.Builder(localSource).build();
            mInterpreter = FirebaseModelInterpreter.getInstance(options);
            listener.OnModelLoadSuccess("model loading successful");
        }
    }

    private boolean isAssetExists(String pathInAssetsDir, Context context){
        AssetManager assetManager = context.getAssets();
        InputStream inputStream = null;
        try {
            inputStream = assetManager.open(pathInAssetsDir);
            if(null != inputStream ) {
                return true;
            }
        }  catch(IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    public void classifyMat(Mat mat, String id) {
        if(mInterpreter != null || downloadInterpreter != null) {
            FirebaseModelInterpreter finalInterpreter = downloadInterpreter != null ? downloadInterpreter : mInterpreter;
            Mat processedMat    = preprocessMatForModel(mat);
            System.out.println("*************************************before infer*********************************************************************");
            runInference(mat, id, finalInterpreter, processedMat.width(), processedMat.height());
        }
    }

    private Mat preprocessMatForModel(Mat mat) {
        //  Mat rotatedMat = rotateMat(mat);

        //mean and std deviation
        Mat gray_img        = new Mat();
        Imgproc.cvtColor(mat, gray_img, Imgproc.COLOR_BGR2GRAY);
        //Core.bitwise_not(gray_img, gray_img);

        //MatOfDouble mu      = new MatOfDouble();
        //MatOfDouble sigma   = new MatOfDouble();
        //Core.meanStdDev(gray_img, mu, sigma);
        gray_img.convertTo(gray_img, org.opencv.core.CvType.CV_32F);
        MatOfDouble sigma   = new MatOfDouble(255L);
        //Mat meanMat         =  new Mat();
        //Core.subtract(gray_img, mu, meanMat);
        Mat matFinal        = new Mat();
        //  Core.divide(meanMat, sigma, matFinal);
       Core.divide(gray_img, sigma, matFinal);
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
        System.out.println("**************************************inside mattotf********************************************************************");
        System.out.println("Width: " + mat.width());
        System.out.println("Height: " + mat.height());
        MatOfByte matOfByte = new MatOfByte();
Imgcodecs.imencode(".jpg", mat, matOfByte);
byte[] jpegByteArray = matOfByte.toArray();

byte[] nv21ByteArray = new byte[mat.width() * mat.height() * 3 / 2];
    System.arraycopy(jpegByteArray, 0, nv21ByteArray, 0, jpegByteArray.length);

// Convert the NV21 byte array to a ByteBuffer
ByteBuffer nv21ByteBuffer = ByteBuffer.wrap(nv21ByteArray);
        // int bytesPerChannel     = 4;
        // ByteBuffer imgData      = ByteBuffer.allocateDirect(bytesPerChannel * DIM_BATCH_SIZE * DIM_IMG_SIZE_X * DIM_IMG_SIZE_Y * DIM_PIXEL_SIZE);
        // imgData.order(ByteOrder.nativeOrder());
        // imgData.rewind();

        // for (int i = 0; i < DIM_IMG_SIZE_Y; ++i) {
        //     for (int j = 0; j < DIM_IMG_SIZE_X; ++j) {
        //         imgData.putFloat((float)mat.get(i,j)[0]);
        //     }
        // }
        return nv21ByteBuffer;
    }

    private void runInference(Mat matImage, String id, FirebaseModelInterpreter interpreter, int width, int height) {
        System.out.println("**********************************inside inferetence************************************************************************");
        if (interpreter !=  null) {
            try {
                // FirebaseModelInputs inputs          = new FirebaseModelInputs.Builder().add(data).build();
                System.out.println("**********************************************************************************************************");
                // System.out.println("**********************************************************************************************************");
                // System.out.println("**********************************************************************************************************");
                //  System.out.println(interpreter.getInputIndex("shape"));
                // System.out.println("**********************************************************************************************************");
                // System.out.println("**********************************************************************************************************");
                // System.out.println("**********************************************************************************************************");
                // System.out.println("**********************************************************************************************************");
//                Log.e("SrlSDK::Scanner", "input" + String.valueOf(interpreter.get_input_details()[0]["dtype"]));
//                Log.e("SrlSDK::Scanner", "output" + String.valueOf(interpreter.get_output_details()[0]["dtype"]));
//                Log.e("SrlSDK::Scanner", "output" + String.valueOf(interpreter.get_output_details()[0]["shape"]));
    //             data.rewind();
    //             byte[] imageBytes= new byte[data.remaining()];
    //             data.get(imageBytes);
    //             System.out.println(imageBytes.length);
    //             Bitmap outPut_Image = Bitmap.createBitmap(640, 480, Bitmap.Config.ARGB_8888);
    // outPut_Image.copyPixelsFromBuffer(ByteBuffer.wrap(imageBytes));
    //             System.out.println("**after bitmap***"+outPut_Image);

    ////////////////some success////////////////////////////////////////////////
            // FirebaseVisionImageMetadata metadata = new FirebaseVisionImageMetadata.Builder()
            //     .setWidth(width)
            //     .setHeight(height)
            //     .setFormat(FirebaseVisionImageMetadata.IMAGE_FORMAT_NV21) // Replace with your image format
            //     .setRotation(FirebaseVisionImageMetadata.ROTATION_0)
            //     .build();
            //     FirebaseVisionImage img = FirebaseVisionImage.fromByteBuffer(data, metadata);
                ///////////////////////////////end////////////////////

                
                ///////////////old one//////////////////////////
//                 FirebaseVisionTextRecognizer textRecognizer = FirebaseVision.getInstance().getOnDeviceTextRecognizer();
//                 System.out.println("**after textrecog***");

// //                interpreter.run(inputs, mDataOptions)
//                 textRecognizer.processImage(image)
//                         .addOnSuccessListener(result -> {
//                             System.out.println("**inside success***");
//                             System.out.println(result);
//                             String output        = result.getText();
//                             System.out.println("data here"+output);
//                         })


///////////////////////////
// int width = 800; // Larger image for better recognition
//        int height = 600;
//        String embeddedText = "This is the embedded text for testing text recognition in Firebase ML Kit. Please recognize this text accurately."; // Larger and clearer text
//        byte[] nv21ByteArray = createEmbeddedTextNV21Image(width, height, embeddedText);
//
//        // Convert the NV21 byte array to a ByteBuffer
//        ByteBuffer nv21ByteBuffer = ByteBuffer.wrap(nv21ByteArray);
//
//        // Create FirebaseVisionImageMetadata
//        FirebaseVisionImageMetadata metadata = new FirebaseVisionImageMetadata.Builder()
//                .setFormat(FirebaseVisionImageMetadata.IMAGE_FORMAT_NV21)
//                .setWidth(width)
//                .setHeight(height)
//                .setRotation(FirebaseVisionImageMetadata.ROTATION_0)
//                .build();
//
//        // Create a FirebaseVisionImage from the ByteBuffer and metadata
//        FirebaseVisionImage image = FirebaseVisionImage.fromByteBuffer(nv21ByteBuffer, metadata);
//
//        // Get a text recognizer
//        FirebaseVisionTextRecognizer textRecognizer = FirebaseVision.getInstance().getOnDeviceTextRecognizer();
//
//        // Process the image for text recognition
//        Task<FirebaseVisionText> result = textRecognizer.processImage(image);
//
//        // Handle the recognition result
//        result.addOnSuccessListener(firebaseVisionText -> {
//            if (firebaseVisionText != null) {
//                String recognizedText = firebaseVisionText.getText();
//                System.out.println("Recognized Text: " + recognizedText);
//            } else {
//                System.out.println("No text recognized.");
//            }
//        })
//                        .addOnFailureListener(e -> {
//                             System.out.println("some error failed predict" + e);
//                            e.printStackTrace();
//                            predictionListener.OnPredictionFailed("PREDICTION FAILED", id);
//                        });


///////////////////new mlkit////////////////////////////////////
// int width = 800; // Larger image for better recognition
//         int height = 600;
//         String embeddedText = "This is the embedded text for testing text recognition with ML Kit. Please recognize this text accurately."; // Larger and clearer text
//         byte[] nv21ByteArray = createEmbeddedTextNV21Image(width, height, embeddedText);

//         // Create an InputImage from the NV21 byte array
//         InputImage image = InputImage.fromByteArray(
//             nv21ByteArray,
//             width,
//             height,
//             0,  // Rotation degrees
//             InputImage.IMAGE_FORMAT_NV21
//         );

//         // Get a text recognizer
//         TextRecognizer textRecognizer = TextRecognition.getClient();

//         // Process the image for text recognition
//         Task<Text> result =
//             textRecognizer.process(image)
//             .addOnSuccessListener(text -> {
//                 String recognizedText = processTextBlocks(text);
//                 System.out.println("Recognized Text: " + recognizedText);
//             })
//             .addOnFailureListener(e -> {
//                 if (e instanceof MlKitException) {
//                     MlKitException mlKitException = (MlKitException) e;
//                     System.out.println("Text recognition exception: " + mlKitException.getMessage());
//                 } else {
//                     System.out.println("Text recognition exception: " + e.getMessage());
//                 }
//             });
//


//////////////////////mlkit from image//////////////////////////
//Bitmap img = getBitmapFromAsset(context, "test-image.png"); //working code
/////////////from on the fly bitmap///////////
// int width = 800; // Larger image for better recognition
//         int height = 600;
//         String embeddedText = "This is the embedded text for testing text recognition with ML Kit. Please recognize this text accurately."; // Larger and clearer text
//         Bitmap bitmap = createEmbeddedTextBitmap(width, height, embeddedText);

////////////////////////////end/////////////////////

///////////from bytebuffer////////////////
// byte[] byteArray = new byte[data.remaining()];
//         data.get(byteArray);

//         // Create a YuvImage from the NV21 byte array
//         YuvImage yuvImage = new YuvImage(byteArray, ImageFormat.NV21, width, height, null);

//         // Convert YuvImage to a JPEG Bitmap
//         ByteArrayOutputStream out = new ByteArrayOutputStream();
//         yuvImage.compressToJpeg(new Rect(0, 0, width, height), 100, out);
//         byte[] jpegArray = out.toByteArray();
//         Bitmap bitmap = BitmapFactory.decodeByteArray(jpegArray, 0, jpegArray.length);
/////////////////////end/////////////////////////////

/////mattobitmap///////////
System.out.println("Width: " + matImage.width());
        System.out.println("Height: " + matImage.height());
Bitmap bitmap = Bitmap.createBitmap(matImage.cols(), matImage.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(matImage, bitmap);
InputImage image = InputImage.fromBitmap(bitmap, 0);
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
                byte[] byteArray1 = outputStream.toByteArray();
                System.out.println("Base64 Image: " + Base64.encodeToString(byteArray1, Base64.DEFAULT));
//System.out.println("Base64 Image: " + bitmapToBase64(data));
TextRecognizer textRecognizer = TextRecognition.getClient();
textRecognizer.process(image)
            .addOnSuccessListener(text -> {
                String recognizedText = processTextBlocks(text);
                System.out.println("Recognized Text: " + recognizedText);
                predictionListener.OnTextPredictionSuccess(recognizedText, 100, id);
            })
            .addOnFailureListener(e -> {
                if (e instanceof MlKitException) {
                    MlKitException mlKitException = (MlKitException) e;
                    System.out.println("Text recognition exception: " + mlKitException.getMessage());
                } else {
                    System.out.println("Text recognition exception: " + e.getMessage());
                }
                predictionListener.OnPredictionFailed("PREDICTION FAILED", id);
            });

            } catch (Exception e) {
                System.out.println("some error failed predict out" + e);
                e.printStackTrace();
                predictionListener.OnPredictionFailed("INVALID INTERPRETER", id);
            }
        }
    }

////////////////////////////mattobitmap//////////////////////////
private static Bitmap matToBitmap(Mat mat) {
        System.out.println("***********************inside bitmapmat*****************");
        Bitmap bitmap = Bitmap.createBitmap(mat.cols(), mat.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(mat, bitmap);
    System.out.println("***********************inside bitmapmat done*****************");
        return bitmap;
}

public static ByteBuffer convertMatToByteBuffer(Mat mat) {
    System.out.println("***********************inside bitmapmat*****************");
        int totalBytes = mat.cols() * mat.rows() * mat.channels();
        ByteBuffer byteBuffer = ByteBuffer.allocate(totalBytes);
        mat.get(0, 0, byteBuffer.array());
        System.out.println("***********************inside bitmapmat done*****************");
        return byteBuffer;
    }

///////////////
private static String bitmapToBase64(Bitmap bitmap) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
        byte[] byteArray = outputStream.toByteArray();
        return Base64.encodeToString(byteArray, Base64.DEFAULT);
}

////on the fly bitmap////////////
private static Bitmap createEmbeddedTextBitmap(int width, int height, String text) {
        // Create a blank Bitmap with a white background
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint paint = new Paint();
        paint.setColor(Color.WHITE);
        canvas.drawRect(new RectF(0, 0, width, height), paint);

        // Create a Paint for drawing text
        paint.setColor(Color.BLACK);
        paint.setTextSize(30); // Text size
        paint.setAntiAlias(true);

        // Calculate text dimensions
        Rect bounds = new Rect();
        paint.getTextBounds(text, 0, text.length(), bounds);

        // Calculate text position (centered)
        int x = (width - bounds.width()) / 2;
        int y = (height - bounds.height()) / 2;

        // Draw the embedded text on the Bitmap
        canvas.drawText(text, x, y, paint);

        return bitmap;
    }    

/////////////mlkit img////////////////
    public static Bitmap getBitmapFromAsset(Context context, String filePath) {
        AssetManager assetManager = context.getAssets();

        InputStream is;
        Bitmap bitmap = null;
        try {
            is = assetManager.open(filePath);
            bitmap = BitmapFactory.decodeStream(is);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return bitmap;
    }

    // Create a synthetic NV21 byte array with a simple pattern
   private static byte[] createEmbeddedTextNV21Image(int width, int height, String text) {
        int totalBytes = width * height * 3 / 2;
        byte[] nv21ByteArray = new byte[totalBytes];

        // Create a blank YUV image
        int imageSize = width * height;
        int uvSize = imageSize / 4;
        byte[] yuvBytes = new byte[totalBytes];

        // Fill the Y component (luminance) with a neutral gray value
        for (int i = 0; i < imageSize; i++) {
            yuvBytes[i] = (byte) 128;
        }

        // Embed text data into the Y component (luminance)
        byte[] textBytes = text.getBytes();
        int textWidth = width / 2;
        int textHeight = height / 4;
        int textIndex = 0;

        for (int i = 0; i < textHeight; i++) {
            for (int j = 0; j < textWidth; j++) {
                int yIndex = (height / 2 + i) * width + j * 2;

                if (textIndex < textBytes.length) {
                    yuvBytes[yIndex] = textBytes[textIndex];
                    textIndex++;
                }
            }
        }

        // Copy the Y component (luminance) to the NV21 byte array
        System.arraycopy(yuvBytes, 0, nv21ByteArray, 0, imageSize);

        return nv21ByteArray;
    }

    private static String processTextBlocks(Text text) {
        StringBuilder recognizedText = new StringBuilder();

        for (Text.TextBlock textBlock : text.getTextBlocks()) {
            recognizedText.append(textBlock.getText()).append("\n");
        }

        return recognizedText.toString();
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
