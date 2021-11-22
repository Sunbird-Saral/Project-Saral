import config
import tensorflow as tf

h5_model_path = config.H5_MODEL_PATH

model = tf.keras.models.load_model(h5_model_path)
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
open(config.TF_LITE_SAVE_PATH, "wb").write(tflite_model)