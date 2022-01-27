import numpy as np
import matplotlib.pyplot as plt
from collections import defaultdict
#from tensorflow.keras.utils import np_utils
import np_utils
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.datasets import mnist
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import glob
import random
import cv2
import config

def normalize_images(images):
    '''
    Channel-wise normalization of the input images: subtracted by mean and divided by std

    Args:
        images: 3-D array

    Returns:
        normalized images: 2-D array
    '''
    H, W = 28, 28
    train_data = images.astype('float32') / 255.
    #test_data = test_data.astype('float32') / 255.
    #images = np.reshape(images, (-1, H * W))
    #print(images.shape)
    #numerator = images - np.expand_dims(np.mean(images, 1), 1)
    #denominator = np.expand_dims(np.std(images, 1), 1)

    return train_data

def load_mnist():
    '''
    Load mnist data sets for training, validation, and test.

    Args:
        None

    Returns:
        (x_train, y_train): (4-D array, 2-D array)
        (x_val, y_val): (4-D array, 2-D array)
        (x_test, y_test): (4-D array, 2-D array)
    '''
    #(x_train, y_train), (x_test, y_test) = mnist.load_data()
    train=[]
    label=[]
    for i in sorted(glob.glob(config.IMAGE_PATH)):
        img = cv2.imread(i)
        img= cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        val = int(i.split("/")[-2])
        train.append(img)
        label.append(val)
    data = list(zip(train, label)) 	
    random.shuffle(data)

    train, label = zip(*data)
    train=np.asarray(train)
    label=np.asarray(label)
    x_train=train[0:int(len(train)*0.90)]
    y_train=label[0:int(len(label)*0.90)]
    x_test=train[int(len(train)*0.90):]
    y_test=label[int(len(label)*0.90):]
    
    
    
   
    x_train = x_train.reshape(-1, 28, 28, 1)
    x_test = x_test.reshape(-1, 28, 28, 1)
    x_train = normalize_images(x_train)
    x_test = normalize_images(x_test)
    # y_train = np_utils.to_categorical(y_train) # encode one-hot vector
    # y_test = np_utils.to_categorical(y_test)
    y_train = to_categorical(y_train) # encode one-hot vector
    y_test = to_categorical(y_test)
   

    num_of_test_data = config.TEST_DATA_SIZE
    x_val = x_train[num_of_test_data:]
    y_val = y_train[num_of_test_data:]
    x_train = x_train[:num_of_test_data]
    y_train = y_train[:num_of_test_data]
    
    return (x_train, y_train), (x_val, y_val), (x_test, y_test)


def get_train_generator(x_train, y_train, batch_size = 32):
    '''
    Return augmented training data.

    Args:
        x_train: 4-D array
        y_train: 2-D array
        batch_size: integer

    Returns:
        Instance of ImageDataGenerator
        (See: https://keras.io/preprocessing/image/ )
    '''
    train_datagen = ImageDataGenerator(rotation_range = 15,
                                       width_shift_range = 0.1,
                                       height_shift_range = 0.1,
                                       shear_range = 0.2,
                                       zoom_range = 0.1)

    return train_datagen.flow(x_train, y_train, batch_size = batch_size)

def get_val_generator(x_val, y_val, batch_size = 32):
    '''
    Return augmented validation data.

    Args:
        x_train: 4-D array
        y_train: 2-D array
        batch_size: integer

    Returns:
        Instance of ImageDataGenerator
        (See: https://keras.io/preprocessing/image/ )
    '''
    val_datagen = ImageDataGenerator()

    return val_datagen.flow(x_val, y_val, batch_size = batch_size, shuffle = False)

def get_test_generator(x_test, y_test, **kwars):
    '''
    Same function as get_val_generator()
    '''
    return get_val_generator(x_test, y_test, **kwars)

def plot(history, path, title = None):
    '''
    Plot the trends of loss and metrics during training

    Args:
        history: History.history attribute. It is a return value of fit method.
        title: string

    Returns:
        None
    '''
    dhist = defaultdict(lambda: None) # just in case history doesn't have validation info
    dhist.update(history.history)

    fig, loss_ax = plt.subplots()
    acc_ax = loss_ax.twinx()

    loss_ax.plot(dhist['loss'], 'y', label='training loss')
    if dhist['val_loss']:
        loss_ax.plot(dhist['val_loss'], 'r', label='validation loss')

    acc_ax.plot(dhist['acc'], 'b', label='training acc')
    if dhist['val_acc']:
        acc_ax.plot(dhist['val_acc'], 'g', label='validation acc')

    loss_ax.set_xlabel('epoch')
    loss_ax.set_ylabel('loss')
    acc_ax.set_ylabel('accuracy')

    loss_ax.legend(loc='upper left')
    acc_ax.legend(loc='lower left')

    if title:
        plt.title(title)
    plt.savefig(path, dpi = fig.dpi)
