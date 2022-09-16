# Handwritten digit recognition with MNIST and Keras - Playbook

This repository is for handwritten digit recognition which is integrated to Saral project. Saral is an OCR-plus application that is capable of doing OCR and can also understand the structure of the physical input.
##### total no. of classes- 11(0-10)
- empty or noisy type images are included in class10
 

#### Architectures
- [Resnet164](https://arxiv.org/abs/1603.05027)



#### Augmentation and Normalization
- Channel-wise normalization of input images: substracted by mean and divided by std
- Data augmentation: rotation, width shift, height shift, shearing, zooming


##### To install packages run this command line
```bash
$ pip install -r requirement.txt 
```

## Training
The training can be executed by the following command.
In config file we can have to update training data path and model specific parameters. Once the training is done trained model will be saved in the given path.

#### How to run
```bash
$ python training.py 
```

## Keras to tflite model converter
This can be done using keras_to_tf_converter.py module. As a input it takes path of keras model and save path where we want to save the tflite model. Define them in ./config.py.

#### How to run
```bash
$ python keras_to_tf_converter.py 
```

## TFLite model configuration for Saral App
1. Place the .tflite model file in below project path.
2. Use it in ``org.ekstep.saral.saralsdk.hwmodel.HWClassifier.java`` file
``/Project-Saral/v1.0/frontend/SaralApp/android/saralsdk/src/main/assets``

### Evaluation
##### prediction.ipynb for benchmarking the test dataset for both keras and tflite model at digit and roll number level
#### Config Parameters
```bash


optional arguments:
  --epochs EPOCHS       How many epochs you need to run (default: 10)
  --batch_size BATCH_SIZE
                        The number of images in a batch (default: 64)
  --path_for_weights PATH_FOR_WEIGHTS
                        The path from where the weights will be saved or
                        loaded (default: ./models/VGG16.h5)
  --path_for_image PATH_FOR_IMAGE
                        The path from where the model image will be saved
                        (default: ./images/VGG16.png)
  --path_for_plot PATH_FOR_PLOT
                        The path from where the training progress will be
                        plotted (default: ./images/VGG16_plot.png)
  --data_augmentation DATA_AUGMENTATION
                        0: No, 1: Yes (default: 1)
  --save_model_and_weights SAVE_MODEL_AND_WEIGHTS
                        0: No, 1: Yes (default: 1)
  --load_weights LOAD_WEIGHTS
                        0: No, 1: Yes (default: 0)
  --plot_training_progress PLOT_TRAINING_PROGRESS
                        0: No, 1: Yes (default: 1)
  --save_model_to_image SAVE_MODEL_TO_IMAGE
                        0: No, 1: Yes (default: 1)
```

## File descriptions
```bash
├── images/ # training data: few samples are given for each digit 
├── models/ # model weights (included in this repo)
├── README.md
├── base_model.py # base model interface
├── utils.py # helper functions
├── resnet164.py
├── training.py # training script
   

```
#### ResNet Implementation
- [ResNet Author's Implementation](https://github.com/KaimingHe/resnet-1k-layers/blob/master/resnet-pre-act.lua)

#### Latest training pipelines for Numeric, AplhaNumeric(Block Letters only)
   [Handwritten-Recognition toolkit](https://github.com/project-anuvaad/ocr-toolkit/tree/ocr_toolkit/Handwritten-Recognition)
